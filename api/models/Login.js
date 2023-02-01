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
        user_agent: {
            type: String,
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
        attend: {
            type: String,
            enum: ['O', 'X'],
            default: 'X', 
        },
        abuse: {
            type: String,
            enum: ['O', 'X'],
            default: 'X',
        }       
    },
)

export default mongoose.model('Login', LoginSchema)