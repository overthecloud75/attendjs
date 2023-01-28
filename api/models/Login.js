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
        latitude: {
            type: Number,
            requried: false, 
        },
        longitude: {
            type: Number,
            requried: false, 
        },
        attend: {
            type: Boolean,
            requried: true, 
        }       
    },
)

export default mongoose.model('Login', LoginSchema)