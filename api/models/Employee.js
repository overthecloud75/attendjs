import mongoose from 'mongoose'

const EmployeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        beginDate: {
            type: String,
            required: false,
        },
        endDate: {
            type: String,
            required: false,
        },
        department: {
            type: String,
            required: true,
        },
        employeeId: {
            type: Number,
            required: true,
            unique: true
        },
        rank: {
            type: String,
        },
        position: {
            type: String,
        },
        email: {
            type: String,
            required: false,
        },
        regular: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            required: true,
        },
        attendMode: {
            type: String,
            enum: ['O', 'X'],
            default: 'O',
        }
    },
)

export default mongoose.model('Employee', EmployeeSchema)