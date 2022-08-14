import mongoose from 'mongoose'

const DeviceOnSchema = new mongoose.Schema(
    {
        mac: {
            type: String,
            required: true,
            unique: false
        },
        ip: {
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
        end: {
            type: String,
            required: true,
        },
    },
);

export default mongoose.model('DeviceOn', DeviceOnSchema);