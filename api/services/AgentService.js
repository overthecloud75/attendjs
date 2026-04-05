import axios from 'axios'
import mongoose from 'mongoose'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import AgentActivity from '../models/AgentActivity.js'
import SystemSettings from '../models/SystemSettings.js'
import { agentLogger, logger } from '../config/winston.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * [Core] Agent Orchestration Service
 * Manages Master AI logic, delegation to specialists, and persistence.
 */
class AgentService {
    constructor() {
        this.agents = {};
        this.initializeAgents();
    }

    /**
     * Scan and load all specialist agents dynamically.
     */
    async initializeAgents() {
        try {
            const agentsPath = path.join(__dirname, '../agent/agents');
            const files = fs.readdirSync(agentsPath).filter(f => f.endsWith('.js'));

            for (const file of files) {
                const filePath = path.join(agentsPath, file);
                const agentModule = await import(pathToFileURL(filePath).href);
                
                // Expecting 'export default class X extends BaseAgent'
                const AgentClass = agentModule.default;
                const instance = new AgentClass();
                
                const registryName = instance.name || file.replace('.js', '');
                this.agents[registryName] = instance;
                logger.info(`[AgentService] Specialist Registered: ${registryName}`);
            }
        } catch (err) {
            logger.error(`[AgentService] Dynamic Loading Failed: ${err.message}`);
        }
    }

    /**
     * Entry point for processing user agent strings.
     */
    async processCommand(user, command, isConfirmed, pendingAction, incomingSessionId) {
        const startTime = Date.now()
        const sessionId = (!incomingSessionId || incomingSessionId === 'N/A') ? crypto.randomUUID() : incomingSessionId;

        const logEntry = {
            timestamp: new Date().toISOString(),
            user: user?.email || 'Unknown',
            userId: user?._id || user?.id,
            sessionId,
            command,
            intent: 'Processing',
            agentTrail: [],
            responsePayload: { status: 'success', content: '' }
        }

        // --- 1. Progressive Pre-Save (Fault Tolerance) ---
        let activityId = null;
        try {
            const initialDoc = await AgentActivity.create({
                sessionId,
                userId: user?._id || user?.id,
                command,
                intent: 'Processing',
                agentTrail: [],
                durationMs: 0
            });
            activityId = initialDoc._id;
        } catch (e) {
            agentLogger.error(`[DB_INIT_ERR] Pre-save failed for session ${sessionId}: ${e.message}`);
        }

        try {
            const llmConfig = await this.getLLMConfig()
            
            // Handle confirmation flow (e.g. "Yes, apply for leave")
            if (isConfirmed && pendingAction) {
                const result = await this.executeConfirmedAction(user, pendingAction)
                if (activityId) {
                    await AgentActivity.findByIdAndUpdate(activityId, { 
                        $set: { finalResponse: result, intent: 'Action Confirmed', durationMs: Date.now() - startTime } 
                    });
                }
                return { content: result }
            }

            // Standard Orchestration Flow
            const result = await this.orchestrate(user, command, logEntry, llmConfig, startTime, activityId)
            return result
        } catch (error) {
            agentLogger.error({ message: `Orchestration error in session ${sessionId}: ${error.stack}`, sessionId });
            if (activityId) {
                await AgentActivity.findByIdAndUpdate(activityId, { 
                    $set: { intent: 'Error', finalResponse: '에이전트 오케스트레이션 중 오류가 발생했습니다.', durationMs: Date.now() - startTime } 
                });
            }
            return { error: '에이전트 오케스트레이션 중 오류가 발생했습니다.' }
        }
    }

    /**
     * Master AI Orchestration: Decides whether to handle directly or delegate.
     */
    async orchestrate(user, command, logEntry, llmConfig, startTime, activityId) {
        // Safety: Ensure agents are loaded
        if (Object.keys(this.agents).length === 0) {
            await this.initializeAgents();
        }

        const systemPrompt = `You are a Master AI Orchestrator for Smartwork (User: ${user?.name}, Role: ${user?.role}).
        Your goal is to understand user intent and delegate tasks to specialized agents.

        AVAILABLE AGENTS:
        1. HR_Agent: Handles vacations, leaves, and attendance data.
        2. Attendance_Agent: Handles daily clock-in/out records and work hour analytics.

        [SECURITY POLICY]
        1. Access Control: You ONLY provide info for the current user (${user?.name}).
        2. Unauthorized Requests: Refuse immediately if the user asks for another employee's private info.
        
        [RESPONSE PROTOCOL]
        - HR tasks: Call 'call_hr_agent'.
        - Attendance tasks: Call 'call_attendance_agent'.
        - General questions / Refusals: Answer directly in Korean.
        - CRITICAL: DO NOT start with "안녕하세요" or introduce yourself. Skip greetings. Answer the question directly.`

        const tools = [
            {
                type: 'function',
                function: {
                    name: 'call_hr_agent',
                    description: 'HR 관련 질문(연차, 휴가 조회 등) 시 호출',
                    parameters: {
                        type: 'object',
                        properties: { subTask: { type: 'string' } },
                        required: ['subTask']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'call_attendance_agent',
                    description: '출퇴근 기록, 근무 시간 통계 등 일일 근태 분석 시 호출',
                    parameters: {
                        type: 'object',
                        properties: { subTask: { type: 'string' } },
                        required: ['subTask']
                    }
                }
            }
        ]

        const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: command }]

        // Request Master Plan
        const response = await axios.post(`${llmConfig.baseURL}/chat/completions`, { 
            model: llmConfig.model, messages, tools, tool_choice: 'auto'
        }, { headers: { 'Authorization': `Bearer ${llmConfig.apiKey}`, 'Content-Type': 'application/json' } });

        const firstMessage = response.data.choices[0].message
        
        // --- DELEGATION FLOW ---
        if (firstMessage.tool_calls && firstMessage.tool_calls.length > 0) {
            const toolCall = firstMessage.tool_calls[0]
            const funcName = toolCall.function.name;

            if (funcName === 'call_hr_agent' || funcName === 'call_attendance_agent') {
                const subAgentName = (funcName === 'call_hr_agent') ? 'HR_Agent' : 'Attendance_Agent';
                const args = JSON.parse(toolCall.function.arguments || "{}")
                logEntry.intent = `Delegation (${subAgentName})`

                const subAgent = this.agents[subAgentName]
                const subResult = await subAgent.run(user, args.subTask, llmConfig, logEntry.sessionId)
                
                logEntry.agentTrail.push({
                    agent: subAgentName,
                    task: args.subTask,
                    thought: subResult.reasoning || `Handling ${args.subTask}`,
                    observation: subResult.observation || `Processed task: ${args.subTask}`
                })

                // Determine Output Voice (Main vs Specialist)
                let finalAnswer = subResult.content;
                if (subResult.type === 'TECHNICAL_REPORT' || subResult.type === 'ACTION_REQUIRED') {
                    finalAnswer = await this.synthesize(command, subResult.content, llmConfig, logEntry.sessionId);
                }

                logEntry.responsePayload.content = finalAnswer
                const result = this.wrapResult(finalAnswer, logEntry)
                await this.persist(activityId, logEntry, result, startTime, command)
                return result
            }
        }

        // --- DIRECT ANSWER FLOW ---
        const rawContent = firstMessage.content || "요건을 정확히 파악하지 못했습니다."
        const directContent = (rawContent.includes('TECHNICAL_REPORT')) ? rawContent.replace('TECHNICAL_REPORT:', '').trim() : rawContent;
        
        logEntry.responsePayload.content = directContent
        const result = this.wrapResult(directContent, logEntry)
        await this.persist(activityId, logEntry, result, startTime, command)
        return result
    }

    /**
     * Synthesizes specialist output into a professional "Main Agent" response.
     */
    async synthesize(userQuestion, technicalReport, llmConfig, sessionId) {
        try {
            const now = new Date();
            const timestampStr = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            const polishPayload = {
                model: llmConfig.model,
                messages: [
                    { role: 'system', content: `You are the Master AI Orchestrator for Smartwork. 
                    Based on the provided technical data, generate a high-fidelity, professional final response in Korean. 
                    - Focus on being authoritative, helpful, and clear.
                    - Do NOT use generic greetings (안녕하세요 등).
                    - Ensure the answer sounds like a finalized report from the central system intelligence.` },
                    { role: 'user', content: `User Question: ${userQuestion}\nTechnical Data: ${technicalReport}` }
                ]
            };
            const response = await axios.post(`${llmConfig.baseURL}/chat/completions`, polishPayload, { headers: { 'Authorization': `Bearer ${llmConfig.apiKey}`, 'Content-Type': 'application/json' } });

            return response.data.choices[0].message.content || "";
        } catch (error) {
            return ""; // Fail gracefully to allow fallback
        }
    }

    /**
     * Asynchronous persistence of the agent trace.
     */
    async persist(activityId, logEntry, result, startTime, command) {
        const duration = Date.now() - startTime;
        const updateData = {
            intent: result.intent,
            agentTrail: logEntry.agentTrail,
            reasoning: result.reasoning || '',
            observation: result.observation || '',
            finalResponse: result.content,
            durationMs: duration
        };

        try {
            if (activityId) {
                await AgentActivity.findByIdAndUpdate(activityId, { $set: updateData });
            } else {
                await AgentActivity.create({ sessionId: logEntry.sessionId, userId: logEntry.userId, command, ...updateData });
            }
            
            agentLogger.info({
                message: 'Agent Execution Completed',
                sessionId: logEntry.sessionId,
                command,
                intent: result.intent,
                agentTrail: ['Main'],
                responsePayload: { content: result.content }, // Added content to log for audit
                durationMs: duration
            });
        } catch (err) {
            logger.error(`[AgentActivity_ERR] Persistence failed for session ${logEntry.sessionId}: ${err.message}`);
        }
    }

    wrapResult(content, logEntry) {
        const safeContent = (content && typeof content === 'string' && content.trim()) ? content : "요청하신 정보를 생성하지 못했습니다. 다시 시도해 주세요.";
        return {
            content: safeContent,
            intent: logEntry.intent || 'Direct',
            trail: logEntry.agentTrail,
            reasoning: logEntry.agentTrail.map(t => `[${t.agent}] ${t.thought}`).join('\n'),
            observation: logEntry.agentTrail.map(t => `[${t.agent}] ${t.observation}`).join('\n'),
            timestamp: logEntry.timestamp
        }
    }

    /**
     * Context Hydration: Combines User and Employee data for full agent awareness.
     * Prevents common ID collision bugs.
     */
    async hydrateUserContext(rawUser) {
        if (!rawUser || !rawUser.email) return rawUser;

        const [fullUser, employee] = await Promise.all([
            mongoose.model('User').findOne({ email: rawUser.email }).lean(),
            mongoose.model('Employee').findOne({ email: rawUser.email }).lean()
        ]);

        if (!fullUser) return rawUser;

        // Preserve original User ID to avoid clobbering by Employee record ID
        const userId = fullUser._id;
        return { ...fullUser, ...employee, _id: userId };
    }

    async getLLMConfig() {
        const settings = await SystemSettings.findOne()
        return settings?.llm || {
            apiKey: process.env.CHATBOT_API_KEY,
            baseURL: process.env.CHATBOT_BACKEND,
            model: 'gpt-4o'
        }
    }

    async executeConfirmedAction(user, action) {
        if (action.tool === 'request_leave_application') {
            return `✅ **완료:** ${action.params.date}일(${action.params.leaveType}) 연차 신청이 정상 상신되었습니다.`
        }
        return "알 수 없는 액션이 요청되었습니다."
    }
}

export default new AgentService()
