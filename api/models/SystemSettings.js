import mongoose from 'mongoose'

const SystemSettingsSchema = new mongoose.Schema(
    {
        jobTitles: {
            type: [String],
            default: []
        },
        ranks: {
            type: [String],
            default: []
        },
        security: {
            passwordPolicy: {
                minLength: { type: Number, default: 8 },
                requireSpecialChar: { type: Boolean, default: true },
                expiryDays: { type: Number, default: 90 }
            },
            session: {
                timeoutMinutes: { type: Number, default: 60 },
                maxLoginAttempts: { type: Number, default: 5 }
            },
            ipAccess: {
                allowedIps: [String],
                blockExternalAccess: { type: Boolean, default: false }
            }
        }
    },
    { timestamps: true }
)

export default mongoose.model('SystemSettings', SystemSettingsSchema)
