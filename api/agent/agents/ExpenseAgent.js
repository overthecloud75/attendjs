import BaseAgent from '../BaseAgent.js';
import { agentLogger } from '../../config/winston.js';
import matchTransactionTool from '../tools/expense/MatchTransactionTool.js';
import Upload from '../../models/Upload.js';
import fs from 'fs';
import path from 'path';

/**
 * Expense Management Agent (Smartwork)
 * Handles receipt OCR, expense categorization, and policy compliance.
 * Uses Gemma 4 26B Multimodal capabilities.
 */
export default class ExpenseAgent extends BaseAgent {
    constructor() {
        super();
        this.name = 'Expense_Agent';
        this.description = '지출 영수증 분석 및 정산 업무를 담당하는 전문 요원입니다.';
    }

    async run(user, subTask, llmConfig, sessionId, context = {}) {
        const { receiptUrl } = context;

        const systemPrompt = `You are the Expense Management Specialist for Smartwork.
- Current User: ${user.name} (Employee: ${user.employeeId})
- OBJECTIVE: Analyze receipts and match them with credit card transactions.
- OUTPUT: You must extract data accurately. If an image is provided, focus on:
  1. Merchant Name
  2. Date & Time
  3. Total Amount (including tax)
  4. Individual Items (if visible)
- FORMAT:
  1. Professional markdown report.
  2. At the very end, include a JSON block with keys: merchant, amount (number), date (YYYY-MM-DD HH:mm:ss).
  Example:
  \`\`\`json
  {"merchant": "...", "amount": 1234, "date": "..."}
  \`\`\`
- Language: Korean (KR)`;

        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Multimodal input support
        if (receiptUrl) {
            let finalImageUrl = receiptUrl;

            // Resolve local URL to base64 if it's an internal upload
            if (receiptUrl.includes('/api/upload/image/')) {
                try {
                    const uploadId = receiptUrl.split('/').pop();
                    const upload = await Upload.findById(uploadId);
                    if (upload) {
                        const filePath = path.join(upload.destination, upload.fileName);
                        if (fs.existsSync(filePath)) {
                            const imageBuffer = fs.readFileSync(filePath);
                            const base64Image = imageBuffer.toString('base64');
                            finalImageUrl = `data:${upload.mimetype};base64,${base64Image}`;
                        }
                    }
                } catch (e) {
                    agentLogger.error(`[Expense_Agent] Failed to convert image to base64: ${e.message}`);
                }
            }

            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: subTask || "이 영수증을 분석해서 정산 정보를 추출해줘." },
                    { type: 'image_url', image_url: { url: finalImageUrl } }
                ]
            });
        } else {
            messages.push({ role: 'user', content: subTask });
        }

        const tools = [matchTransactionTool.getDefinition()];

        try {
            const message = await this.callLLM({ command: subTask, messages, tools, llmConfig, sessionId });

            // TOOL CALL HANDLING
            if (message.tool_calls) {
                const toolCall = message.tool_calls[0];
                const funcName = toolCall.function.name;

                if (funcName === 'match_transaction') {
                    const args = JSON.parse(toolCall.function.arguments);
                    const result = await matchTransactionTool.execute(user, args, sessionId);
                    
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
                        type: 'EXPENSE_REPORT', 
                        reasoning: message.reasoning,
                        observation: `영수증 데이터와 법인카드 승인 내역(${args.amount}원)을 대조한 결과 ${result.matchFound ? '일치하는 내역을 확인했습니다.' : '일치하는 내역을 찾지 못했습니다.'}`,
                        toolUsed: matchTransactionTool.name,
                        toolArgs: args,
                        extractedData: result.extractedData // AI might have refined this
                    });
                }
            }

            // Extract JSON for UI display
            let extractedData = null;
            const jsonMatch = message.content.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                try {
                    extractedData = JSON.parse(jsonMatch[1]);
                } catch (e) {
                    agentLogger.error(`[Expense_Agent] JSON parse failed: ${e.message}`);
                }
            }

            return this.wrapResponse(message.content, { 
                type: 'DIRECT',
                reasoning: message.reasoning,
                extractedData
            });

        } catch (error) {
            return this.handleError(error, sessionId);
        }
    }
}
