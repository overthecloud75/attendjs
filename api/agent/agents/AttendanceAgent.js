import BaseAgent from '../BaseAgent.js';
import AttendanceService from '../../services/AttendanceService.js';
import AttendanceSummaryService from '../../services/AttendanceSummaryService.js';

/**
 * Attendance Analyst Agent (Smartwork)
 * Focuses on daily clock-in/out patterns and work hour analytics.
 */
export default class AttendanceAgent extends BaseAgent {
    constructor() {
        super();
        this.name = 'Attendance_Agent';
    }

    async run(user, subTask, llmConfig, sessionId) {
        const messages = [
            { 
                role: 'system', 
                content: `You are the Attendance Analyst for Smartwork. 
                         - Current User: ${user.name} (Employee: ${user.employeeId})
                         - OBJECTIVE: Analyze daily attendance patterns and work hours.
                         - Format: Professional, logic-driven, and concise.` 
            },
            { role: 'user', content: subTask }
        ];

        const tools = [
            {
                type: 'function',
                function: {
                    name: 'get_attendance_history',
                    description: '특정 기간의 출퇴근 기록 및 근무 시간 분석 데이터를 조회합니다.',
                    parameters: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', description: '조회 시작일 (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: '조회 종료일 (YYYY-MM-DD)' }
                        },
                        required: ['startDate', 'endDate']
                    }
                }
            }
        ];

        try {
            const message = await this.callLLM({ command: subTask, messages, tools, llmConfig, sessionId });

            if (message.tool_calls) {
                const toolCall = message.tool_calls[0];
                if (toolCall.function.name === 'get_attendance_history') {
                    const args = JSON.parse(toolCall.function.arguments);
                    const result = await this.getAttendanceHistory(user, args);
                    
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
                        observation: `[AttendanceService] Fetched data for ${user.name} (${args.startDate} ~ ${args.endDate}).` 
                    });
                }
            }

            return this.wrapResponse(message.content || "근태 행 기록을 찾는 데 문제가 발생했습니다.", { type: 'DIRECT' });

        } catch (error) {
            return this.handleError(error, sessionId);
        }
    }

    /**
     * Tool: get_attendance_history
     * Uses AttendanceService and AttendanceSummaryService for logic.
     */
    async getAttendanceHistory(user, { startDate, endDate }) {
        const query = { name: user.name, startDate, endDate };
        const records = await AttendanceService.getAttends(query);
        
        this.validateTarget(records, "해당 기간의 출퇴근 기록");

        const summary = AttendanceSummaryService.summarizeAttends(records);
        const userSummary = summary[user.employeeId] || {};

        return {
            records: records.map(r => ({
                date: r.date,
                clockIn: r.start,
                clockOut: r.end,
                workingHours: r.workingHours,
                status: r.status,
                reason: r.reason
            })),
            totalSummary: {
                workingDays: userSummary.days || 0,
                totalWorkingHours: Math.round((userSummary.workingHours || 0) * 10) / 10
            }
        };
    }
}
