import mongoose from 'mongoose'
import { APPROVAL_STATUS } from '../config/domain.js'
import { EMPLOYEE_STATUS, WORK_MODE, POSITIONS } from '../config/domain.js'

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
            enum: POSITIONS
        },
        email: {
            type: String,
            required: false,
        },
        mobileNo: {
            type: String,
            required: false,
        },
        regular: {
            type: String,
            enum: Object.values(EMPLOYEE_STATUS),
            required: true,
        },
        mode: {
            type: String,
            enum: Object.values(WORK_MODE),
            required: true,
        },
        attendMode: {
            type: String,
            enum: ['O', 'X'],
            default: 'O',
        },
        cardNo: {
            type: String,
        },
    },
)

export default mongoose.model('Employee', EmployeeSchema)