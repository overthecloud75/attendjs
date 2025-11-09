import mongoose from 'mongoose'

const MeetingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true,
        },
        meetingType: {
            type: String,
            required: true,
            enum: ['내부', '외부'],
            default: '내부', 
        },
        name: {
            type: String,
            required: true,
        }
    },
)

export default mongoose.model('Meeting', MeetingSchema)