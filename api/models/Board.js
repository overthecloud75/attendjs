import mongoose from 'mongoose'

const BoardSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
        },
        employeeId : {
            type: Number
        }
    },
    { timestamps: true }
)

export default mongoose.model('Board', BoardSchema)