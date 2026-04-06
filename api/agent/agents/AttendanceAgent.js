import BaseAgent from '../BaseAgent.js';
import { agentLogger } from '../../config/winston.js';
import getAttendanceHistoryTool from '../tools/attendance/GetAttendanceHistoryTool.js';

/**
 * Attendance Analyst Agent (Smartwork)
 * Focuses on daily clock-in/out patterns and work hour analytics.
 * UPDATED: Uses modular BaseTool architecture for better observability.
 */
export default class AttendanceAgent extends BaseAgent {
    constructor() {
        super();
        this.name = 'Attendance_Agent';
    }

    async run(user, subTask, llmConfig, sessionId) {
        const now = new Date();
        const formattedNow = now.toISOString().split('T')[0];
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

        const messages = [
            { 
                role: 'system', 
                content: `You are the Attendance Analyst for Smartwork. 
                         - Current Time: ${formattedNow} (${dayOfWeek})
                         - Current User: ${user.name} (Employee: ${user.employeeId})
                         - OBJECTIVE: Analyze daily attendance patterns and work hours.
                         - DATE_LOGIC: "Last month" means the month preceding ${formattedNow}.
                         - Format: Professional, logic-driven, and concise.` 
            },
            { role: 'user', content: subTask }
        ];

        // Tools are now fetched from modular tool definitions
        const tools = [getAttendanceHistoryTool.getDefinition()];

        try {
            const message = await this.callLLM({ command: subTask, messages, tools, llmConfig, sessionId });

            // TOOL CALL HANDLING
            if (message.tool_calls) {
                const toolCall = message.tool_calls[0];
                const funcName = toolCall.function.name;

                if (funcName === 'get_attendance_history') {
                    const args = JSON.parse(toolCall.function.arguments);
                    
                    // Unified Execution & Logging via BaseTool
                    const result = await getAttendanceHistoryTool.execute(user, args, sessionId);
                    
                    const finalResponse = await this.callLLM({
                        command: subTask,
                        messages: [
                            ...messages,
                            message,
                            { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) }
                        ],
                        llmConfig,
                        sessionId
                    });

                    return this.wrapResponse(finalResponse.content, { 
                        type: 'TECHNICAL_REPORT', 
                        reasoning: message.reasoning,
                        observation: `${user.name}님의 ${args.startDate} ~ ${args.endDate} 기간 내 총 ${result.records?.length || 0}건의 출퇴근 원장 데이터를 분석했습니다.`,
                        toolUsed: getAttendanceHistoryTool.name,
                        toolArgs: args,
                        rawToolResult: result
                    });
                }
            }

            return this.wrapResponse(message.content || "근태 관련 정보를 찾는 데 문제가 발생했습니다.", { type: 'DIRECT' });

        } catch (error) {
            return this.handleError(error, sessionId);
        }
    }
}

