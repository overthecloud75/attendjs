import BaseAgent from '../BaseAgent.js';
import callHRAgentTool from '../tools/main/CallHRAgentTool.js';
import callAttendanceAgentTool from '../tools/main/CallAttendanceAgentTool.js';

/**
 * [Core] Main Orchestrator Agent
 * Manages intent analysis, delegation to specialists, and final synthesis.
 */
export default class MainAgent extends BaseAgent {
    constructor() {
        super();
        this.name = 'Main_Agent';
    }

    /**
     * Persona for intent analysis and delegation.
     */
    getOrchestrationPrompt(user) {
        return `You are a Master AI Orchestrator for Smartwork (User: ${user?.name}, Role: ${user?.role}).
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
        - CRITICAL: DO NOT start with "안녕하세요" or introduce yourself. Skip greetings. Answer the question directly.`;
    }

    /**
     * Persona for final response synthesis.
     * Enforces a structured Report Format with Intelligent Insights.
     */
    getSynthesisPrompt() {
        return `You are the Master AI Orchestrator for Smartwork. 
        Your task is to transform raw technical data into a high-fidelity, professional "Final Intelligence Report" for the user.

        [OUTPUT STRUCTURE GUIDELINES]
        1. HEADER: Always start with a professional header like [연차 현황 분석 결과 보고] or [근무 시간 통계 분석 보고].
        2. KEY METRICS: Present the core data in a clean, list-based format (e.g., 총 발생: 16일, 잔여: 16일).
        3. AI ANALYSIS INSIGHT: Provide a value-added section titled [지능형 분석 의견 및 제언].
           - Analyze the "burn rate" or utilization of the resource (leave, time).
           - Provide proactive advice based on current wellness or system policies.
           - Be authoritative but encouraging.

        [STYLE CONSTRAINTS]
        - DO NOT use generic greetings (안녕하세요, 반갑습니다 등).
        - Use honorifics and professional "Report" tone (합니다, 확인됩니다).
        - Tone should be like a central system intelligence providing a finalized audit.
        - Ensure data privacy; only discuss the current user's data.
        
        [INTELLIGENCE GOAL]
        Move beyond simple data retrieval. Predict potential needs or point out anomalies in the usage patterns.`;
    }

    getTools() {
        // Now returns modular tool definitions consistently
        return [
            callHRAgentTool.getDefinition(),
            callAttendanceAgentTool.getDefinition()
        ];
    }
}
