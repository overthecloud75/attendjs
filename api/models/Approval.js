import mongoose from 'mongoose'
import { APPROVAL_STATUS } from '../config/domain.js'

const ApprovalSchema = new mongoose.Schema(
    {
        approvalType: {
            type: String,
            enum: ['attend', 'payment'],
            default: 'attend'
        },
        employeeId: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true
        },
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        cardNo: {
            type: String,
            default: ''
        },
        reason: {
            type: String,
            required: true
        },
        etc: {
            type: String,
        },
        approverName: {
            type: String,
            required: true
        },
        approverEmail: {
            type: String,
            required: true
        },
        consenterName: {
            type: String,
            default: ''
        },
        consenterEmail: {
            type: String,
            default: ''
        },
        paymentId: {
            type: String,
            default: ''
        },
        status: {
            type: String, 
            enum: Object.values(APPROVAL_STATUS),
            default: APPROVAL_STATUS.PENDING
        },
        content: {
            type: String
        }
    },
    { timestamps: true }
)

export default mongoose.model('Approval', ApprovalSchema)