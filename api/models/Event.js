import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema(
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
        employeeId: {
            type: Number,     
        },
        department: {
            type: String,     
        },
    },
)

export default mongoose.model('Event', EventSchema)