import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        employeeId: {
            type: Number,
            unique: true
        },
        begin: {
            type: String,
        },
        end: {
            type: String,
        },
        status: {
            type: String,
        },
        workingHours: {
            type: Number,
        },
        reason: {
            type: String,
        },
        regular: {
            type: String,
        },
    },
);

export default mongoose.model('Report', ReportSchema)