import mongoose from 'mongoose'

const CreditCardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        cardNo: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        people: {
            type: Number,
            required: true,
        },
        perPrice: {
            type: Number,
            required: true,
        },
        use: {
            type: String,
            required: true,
        }
    },
)

export default mongoose.model('CreditCard', CreditCardSchema)