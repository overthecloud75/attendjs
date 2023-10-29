import mongoose from 'mongoose'
import { WORKING } from '../config/working.js'

const getReasons = () => {
    const reasons = Object.keys(WORKING.status) 
    return reasons
}

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
        reason: {
            type: String,
            enum: getReasons(),
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
        status: {
            type: String, 
            enum: ['Pending', 'Active', 'Cancel'],
            default: 'Pending'
        }
    },
    { timestamps: true }
)

export default mongoose.model('Approval', ApprovalSchema)