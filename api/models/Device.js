import mongoose from 'mongoose'

const DeviceSchema = new mongoose.Schema(
    {
        mac: {
            type: String,
            required: true,
            unique: true
        },
        ip: {
            type: String,
            required: false,
        },
        ipStr: {
            type: String,
            required: false,
        },
        registerDate: {
            type: String,
            required: false,
        },
        endDate: {
            type: String,
            required: false,
        },
        vendor: {
            type: String,
            required: false,
        },
        vendor: {
            type: String,
            required: false,
        },
        os: {
            type: String,
            required: false,
        },
        accuracy: {
            type: String,
            required: false,
        },
        info: {
            type: String,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        owner: {
            type: String,
            required: false,
        },
        employeeId: {
            type: Number,
            required: false,
        },
    },
);

export default mongoose.model('Device', DeviceSchema);