import BaseAgent from '../BaseAgent.js';
import LeaveService from '../../services/LeaveService.js';
import { agentLogger } from '../../config/winston.js';

/**
 * HR Specialist Agent (Smartwork)
 * Focuses on long-term leave entitlements and history using LeaveService.
 */
export default class HRAgent extends BaseAgent {
    constructor() {
        super();
        this.name = 'HR_Agent';
    }

    async run(user, subTask, llmConfig, sessionId) {
        const messages = [
            { 
                role: 'system', 
                content: `You are the HR Specialist for Smartwork. 
                         - Current User: ${user.name} (Role: ${user.role || 'USER'})
                         - OBJECTIVE: Manage leaves ONLY for the current user.
                         - POLICY: Access to other employees' data is strictly prohibited.
                         - Format: Be professional and concise. Skip internal reasoning if the answer is clear.` 
            },
            { role: 'user', content: subTask }
        ];

        const tools = [
            {
                type: 'function',
                function: {
                    name: 'get_leave_balance',
                    description: '사용자의 남은 연차 일수를 조회합니다.',
                    parameters: { type: 'object', properties: {} }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'request_leave_application',
                    description: '휴가 신청 절차를 시작합니다.',
                    parameters: {
                        type: 'object',
                        properties: {
                            leaveType: { type: 'string', enum: ['연차', '반차', '공가', '병가'] },
                            startDate: { type: 'string', description: 'YYYY-MM-DD' },
                            endDate: { type: 'string', description: 'YYYY-MM-DD' },
                            reason: { type: 'string' }
                        },
                        required: ['leaveType', 'startDate', 'endDate']
                    }
                }
            }
        ];

        try {
            const message = await this.callLLM({ command: subTask, messages, tools, llmConfig, sessionId });

            if (message.tool_calls) {
                const toolCall = message.tool_calls[0];
                const funcName = toolCall.function.name;

                if (funcName === 'get_leave_balance') {
                    const result = await this.getLeaveBalance(user, sessionId);
                    const finalResponse = await this.callLLM({
                        command: subTask,
                        messages: [...messages, message, { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) }],
                        llmConfig,
                        sessionId
                    });

                    return this.wrapResponse(finalResponse.content, { 
                        type: 'TECHNICAL_REPORT', 
                        observation: `[LeaveService] Fetched records for ${user.name}. Result: ${finalResponse.content}`
                    });
                }

                if (funcName === 'request_leave_application') {
                    const args = JSON.parse(toolCall.function.arguments);
                    const msg = `**[상신 대기]** ${args.startDate} ${args.leaveType} 신청을 진행할까요? 사유: ${args.reason || '없음'}`;
                    
                    return this.wrapResponse(msg, { 
                        type: 'ACTION_REQUIRED', 
                        message: msg,
                        action: { 
                            type: 'LEAVE_REQUEST', 
                            params: args 
                        } 
                    });
                }
            }

            return this.wrapResponse(message.content || "요청하신 정보를 찾을 수 없습니다.", { type: 'DIRECT' });

        } catch (error) {
            return this.handleError(error, sessionId);
        }
    }

    /**
     * Tool: get_leave_balance
     * Integrates with LeaveService for single golden source of logic.
     */
    async getLeaveBalance(user, sessionId) {
        if (!user.beginDate) {
             const err = new Error("입사일 정보가 없어 연차 계산이 불가능합니다.");
             err.code = 'CONFIG_MISSING';
             throw err;
        }

        const summary = await LeaveService.getLeftLeaveSummary({ 
            employeeId: user.employeeId, 
            name: user.name, 
            beginDate: user.beginDate 
        });

        this.validateTarget(summary, "연차 내역");

        return {
            name: summary.name,
            remainingAnnualLeave: summary.leftAnnualLeave,
            totalAnnualLeave: summary.defaultAnnualLeave,
            pending: summary.pending
        };
    }
}
