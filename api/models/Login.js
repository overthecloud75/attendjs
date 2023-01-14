import mongoose from 'mongoose'

const LoginSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        user_agent: {
            type: String,
            required: false,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
    },
)

export default mongoose.model('Login', LoginSchema)