import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        beginDate: {
            type: String,
            required: false,
        },
        endDate: {
            type: String,
            required: false,
        },
        department: {
            type: String,
            required: true,
        },
        employeeId: {
            type: Number,
            required: true
        },
        rank: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: false,
            unique: true
        },
        regular: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            required: true,
        },
    },
);

export default mongoose.model("Employee", EmployeeSchema);