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
        user_agent: {
            type: String,
            requried: true,
        },
        location: {
            type: Object,
            requried: false, 
        }      
    },
)

export default mongoose.model('Login', LoginSchema)