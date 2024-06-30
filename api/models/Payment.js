import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema(
    {
        employeeId: {
            type: Number,
            required: true,
        },
        destination : {
            type: String,
            required: true,
        },
        fileName : {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Payment', PaymentSchema)