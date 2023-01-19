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
        // ip, user_agent, location
        beginData: {
            type: Object,
            required: true
        },
        endData: {
            type: Object,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        begin: {
            type: String,
            required: true,
        },
        beginPlace: {
            type: String,
            required: true  
        },
        end: {
            type: String,
            required: false,
        },
        endPlace: {
            type: String,
            required: false  
        },
    },
)

export default mongoose.model('Login', LoginSchema)