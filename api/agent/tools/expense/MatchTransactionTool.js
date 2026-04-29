import BaseTool from '../../BaseTool.js';
import CreditCardService from '../../../services/CreditCardService.js';

/**
 * Transaction Matching Tool
 * Matches extracted receipt data with actual credit card approval history.
 */
class MatchTransactionTool extends BaseTool {
    constructor() {
        const schema = {
            type: 'object',
            properties: {
                amount: { type: 'number', description: '영수증에 적힌 총 결제 금액' },
                date: { type: 'string', description: '결제일 (YYYY-MM-DD)' },
                merchant: { type: 'string', description: '상호명 또는 가맹점명' }
            },
            required: ['amount']
        };
        super('match_transaction', '영수증 데이터를 법인카드 승인 내역과 대조합니다.', schema);
    }

    async run(user, args, sessionId) {
        const transaction = await CreditCardService.findMatchingTransaction(user, args);

        if (!transaction) {
            return {
                matchFound: false,
                message: "일치하는 카드 승인 내역을 찾을 수 없습니다. 수기 정산이 필요할 수 있습니다.",
                extractedData: args
            };
        }

        return {
            matchFound: true,
            transactionId: transaction._id,
            cardNo: transaction.cardNo,
            matchedPrice: transaction.price,
            usage: transaction.use,
            merchant: transaction.content,
            message: "카드 승인 내역과 일치하는 항목을 찾았습니다.",
            extractedData: args
        };
    }
}

export default new MatchTransactionTool();
