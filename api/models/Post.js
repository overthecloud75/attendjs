import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
    {
        boardType: {
            type: String,
            enum: ['NOTICE', 'FREE', 'QNA', 'ARCHIVE'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        authorEmail: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        files: [
            {
                filename: String,
                path: String,
                size: Number,
                originalname: String,
                mimetype: String
            }
        ],
    },
    { timestamps: true }
)

export default mongoose.model('Post', PostSchema)
