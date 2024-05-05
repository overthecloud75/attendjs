import mongoose from 'mongoose'

const LoginSchema = new mongoose.Schema(
    {
        employeeId: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        ip: {
            type: String, 
            required: true,
        },
        isMobile: {
            type: String, 
            enum: ['O', 'X'],
            default: 'X', 
        },
        platform: {
            type: String,
            requried: true,
        },
        user_agent: {
            type: String,
            requried: true,
        },
        width: {
            type: Number,
            requried: true,
        },
        height: {
            type: Number,
            requried: true,
        },
        latitude: {
            type: Number,
            requried: false, 
        },
        longitude: {
            type: Number,
            requried: false, 
        },
        accuracy: {
            type: Number, 
            required: true,
        },
        attend: {
            type: String,
            enum: ['O', 'X'],
            default: 'X', 
        },
        hash: {
            type: Number, 
            required: true, 
        },
        cloudflareCheck: {
            type: String,
            enum: ['O', 'X'],
        },
        timestamp: {
            type: Number, 
            required: false, 
        }         
    }, 
)

export default mongoose.model('Login', LoginSchema)