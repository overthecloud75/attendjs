import BaseTool from '../../BaseTool.js';

/**
 * Delegation Tool for Expense Agent
 */
class CallExpenseAgentTool extends BaseTool {
    constructor() {
        const schema = {
            type: 'object',
            properties: {
                subTask: { type: 'string', description: '비용 정산 및 영수증 처리 관련 요청 사항' }
            },
            required: ['subTask']
        };
        super('call_expense_agent', '비용 정산, 영수증 OCR 분석 및 지출 결재 관련 업무를 전문 에이전트에게 위임합니다.', schema);
    }

    async run(user, args, sessionId) {
        // This is a placeholder; AgentService handles the actual delegation logic.
        return { delegateTo: 'Expense_Agent', subTask: args.subTask };
    }
}

export default new CallExpenseAgentTool();
