import BaseTool from '../../BaseTool.js'

/**
 * Attendance Delegation Tool (Main Orchestrator)
 * Delegates a task to the Attendance Specialist Agent.
 */
class CallAttendanceAgentTool extends BaseTool {
    constructor() {
        const schema = {
            type: 'object',
            properties: { subTask: { type: 'string', description: '일일 근태, 출퇴근 기록 조회 등' } },
            required: ['subTask']
        };
        super('call_attendance_agent', '출퇴근 및 근태 일지 분석 질문 시 호출하여 업무를 위임합니다.', schema);
    }

    async run(user, { subTask }, sessionId) {
        // This is a "Proxy Tool" that orchestrates sub-agents
        return { delegateTo: 'Attendance_Agent', task: subTask };
    }
}

export default new CallAttendanceAgentTool();
