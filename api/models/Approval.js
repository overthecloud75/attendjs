import mongoose from 'mongoose'

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
            enum: ['Pending', 'Active', 'Cancel', 'Wrong'],
            default: 'Pending'
        },
        confirmationCode: { 
            type: String, 
            unique: true 
        },
    },
    { timestamps: true }
)

export default mongoose.model('Approval', ApprovalSchema)