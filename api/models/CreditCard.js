import mongoose from 'mongoose'

const CreditCardSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true, 
        }, 
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
            enum: ['식권', '커피', '식사', '도서', '사무용품', '소모품'],
            required: true,
        },
        content: {
            type: String, 
        }
    },
    { timestamps: true }
)

export default mongoose.model('CreditCard', CreditCardSchema)