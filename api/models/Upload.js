import mongoose from 'mongoose'

const UploadSchema = new mongoose.Schema(
    {
        employeeId: {
            type: Number,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
            unique: true
        },
        width: {
            type: Number,
            required: false,
        },
        height: {
            type: Number,
            required: false,
        },
        size: {
            type: Number,
            required: false
        },
        mimetype: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
)

export default mongoose.model('Upload', UploadSchema)
