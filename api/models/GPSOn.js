import mongoose from 'mongoose'

const GPSOnSchema = new mongoose.Schema(
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
        begin: {
            type: String,
            required: true,
        },
        beginPlace: {
            type: String,
            required: true  
        },
        end: {
            type: String,
            required: true,
        },
        endPlace: {
            type: String,
            required: true  
        },
    },
)

export default mongoose.model('GPSOn', GPSOnSchema)