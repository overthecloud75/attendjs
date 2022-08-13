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
            unique: true
        },
        img: {
            type: String,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        emailConfirm: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('User', UserSchema)