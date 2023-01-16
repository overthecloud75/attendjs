import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true,
            unique: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        dev: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Location', LocationSchema)