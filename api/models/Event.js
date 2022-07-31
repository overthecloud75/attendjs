import mongoose from "mongoose";

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
        id: {
            type: Number,
            unique: true,
            required: true
        },
    },
);

export default mongoose.model("Event", EventSchema);