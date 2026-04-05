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
        },
        llm: {
            apiKey: { type: String, default: '' },
            baseURL: { type: String, default: 'https://api.openai.com/v1' },
            model: { type: String, default: 'gpt-4o' },
            temperature: { type: Number, default: 0.7 }
        }
    },
    { timestamps: true }
)

export default mongoose.model('SystemSettings', SystemSettingsSchema)
