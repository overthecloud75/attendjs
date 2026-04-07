import BaseAgent from '../BaseAgent.js';
import { agentLogger } from '../../config/winston.js';
import getLeaveBalanceTool from '../tools/hr/GetLeaveBalanceTool.js';
import requestLeaveApplicationTool from '../tools/hr/RequestLeaveApplicationTool.js';

/**
 * HR Specialist Agent (Smartwork)
 * Focuses on long-term leave entitlements and history.
 * UPDATED: Uses modular BaseTool architecture for better observability.
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
                         - TERMINOLOGY: Always use Korean terms: '연차' for 'Full', '오전반차' for 'AM', and '오후반차' for 'PM'. Never use English code names in your final response.
                         - LEAVE POLICY SUMMARY: 
                            1. Annual leave (Full) is 1 day. 
                            2. Half-day leaves (AM/PM) are 0.5 days.
                            3. New employees accrue 1 day per month in their first year. 
                            4. Standard annual leave starts from 15 days for those with more than 1 year of service.
                            5. Applications must be submitted before the leave date.
                         - Format: Be professional and concise. Skip internal reasoning if the answer is clear. If a user asks about policy, use the summary provided above.
                         - PROACTIVE: After answering about policy, you may suggest checking their remaining balance using your tools if relevant.`
            },
            { role: 'user', content: subTask }
        ];

        const tools = [
            getLeaveBalanceTool.getDefinition(),
            requestLeaveApplicationTool.getDefinition()
        ];

        try {
            const message = await this.callLLM({ command: subTask, messages, tools, llmConfig, sessionId });

            if (message.tool_calls) {
                const toolCall = message.tool_calls[0];
                const funcName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments || "{}");
                
                if (funcName === 'get_leave_balance') {
                    const result = await getLeaveBalanceTool.execute(user, args, sessionId);
                    
                    const finalResponse = await this.callLLM({
                        command: subTask,
                        messages: [...messages, message, { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) }],
                        llmConfig,
                        sessionId
                    });

                    return this.wrapResponse(finalResponse.content, { 
                        type: 'TECHNICAL_REPORT', 
                        reasoning: message.reasoning,
                        observation: `인사 DB에서 ${user.name}님의 기사용 연차와 발생분을 대조하여 잔여 데이터를 추출했습니다.`,
                        toolUsed: getLeaveBalanceTool.name,
                        toolArgs: args,
                        rawToolResult: result
                    });
                }

                if (funcName === 'request_leave_application') {
                    const result = await requestLeaveApplicationTool.execute(user, args, sessionId);
                    
                    // LLM interprets the raw data for a professional confirmation message
                    const finalResponse = await this.callLLM({
                        command: subTask,
                        messages: [...messages, message, { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) }],
                        llmConfig,
                        sessionId
                    });

                    return this.wrapResponse(finalResponse.content, { 
                        type: 'ACTION_REQUIRED', 
                        reasoning: message.reasoning,
                        observation: `[사용자 확인 대기] ${args.date}일자 연차 신청서 작성을 마쳤습니다.`,
                        toolUsed: requestLeaveApplicationTool.name,
                        toolArgs: args,
                        rawToolResult: result
                    });
                }
            }

            return this.wrapResponse(message.content || "요청하신 정보를 찾을 수 없습니다.", { type: 'DIRECT' });

        } catch (error) {
            return this.handleError(error, sessionId);
        }
    }
}

