import mongoose from 'mongoose'

const UploadSchema = new mongoose.Schema(
    {
        employeeId: {
            type: Number,
            required: true,
        },
        originalName : {
            type: String,
            required: true,
        },
        destination : {
            type: String,
            required: true,
        },
        fileName : {
            type: String,
            required: true,
            unique: true
        },
        width : {
            type: Number,
            required: true,
        },
        height : {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Upload', UploadSchema)
