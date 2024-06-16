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
    },
    { timestamps: true }
)

export default mongoose.model('Upload', UploadSchema)
