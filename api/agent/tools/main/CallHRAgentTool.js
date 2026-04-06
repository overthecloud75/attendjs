import BaseTool from '../../BaseTool.js'

/**
 * HR Delegation Tool (Main Orchestrator)
 * Delegates a task to the HR Specialist Agent.
 */
class CallHRAgentTool extends BaseTool {
    constructor() {
        const schema = {
            type: 'object',
            properties: { subTask: { type: 'string', description: 'HR 관련 질문(연차, 내역 조회 등)' } },
            required: ['subTask']
        };
        super('call_hr_agent', 'HR 관련 질문 시 호출하여 업무를 위임합니다.', schema);
    }

    async run(user, { subTask }, sessionId) {
        // This is a "Proxy Tool" that orchestrates sub-agents
        return { delegateTo: 'HR_Agent', task: subTask };
    }
}

export default new CallHRAgentTool();
