import mongoose from 'mongoose'
import { APPROVAL_STATUS } from '../config/domain.js'

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        employeeId: {
            type: Number,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: [APPROVAL_STATUS.PENDING, APPROVAL_STATUS.ACTIVE],
            default: APPROVAL_STATUS.PENDING
        },
        confirmationCode: {
            type: String,
            unique: true
        },
        otp: {
            type: String,
            required: false,
        },
        apiKey: {
            type: String,
            required: false
        },
        position: {
            type: String, // Job Title
            default: ''
        },
        rank: {
            type: String, // Rank/Level
            default: ''
        },
        failedLoginAttempts: {
            type: Number,
            default: 0
        },
        lockoutUntil: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
)

export default mongoose.model('User', UserSchema)