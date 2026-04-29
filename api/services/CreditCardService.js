import CreditCard from '../models/CreditCard.js';

/**
 * Service Layer for Credit Card Transactions
 */
export default class CreditCardService {
    /**
     * Find a transaction matching the given criteria.
     * @param {Object} user 
     * @param {Object} criteria { amount, date, merchant }
     */
    static async findMatchingTransaction(user, { amount, date, merchant }) {
        // Query logic: match by email and approximate criteria
        const query = {
            email: user.email,
            price: amount
        };

        // If date is provided, match by date (YYYY-MM-DD)
        if (date) {
            query.date = { $regex: new RegExp(`^${date}`) };
        }

        const transactions = await CreditCard.find(query).lean();
        
        // Simple heuristic: if merchant is provided, look for it in the content or other fields
        if (merchant && transactions.length > 1) {
            return transactions.find(t => 
                (t.content && t.content.includes(merchant)) || 
                (t.use && t.use.includes(merchant))
            ) || transactions[0];
        }

        return transactions[0] || null;
    }
}
