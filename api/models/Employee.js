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
            enum: ['상근', '비상근', '병특', '퇴사'],
            required: true,
        },
        mode: {
            type: String,
            enum: ['내근', '파견'],
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