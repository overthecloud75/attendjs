import mongoose from 'mongoose'

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
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        confirmationCode: { 
            type: String, 
            unique: true 
        },
    },
    { timestamps: true }
)

export default mongoose.model('User', UserSchema)