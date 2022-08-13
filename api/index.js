import express from "express";
import { logger } from './config/winston.js';
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import attendRoute from "./routes/attend.js";
import summaryRoute from "./routes/summary.js";
import deviceRoute from "./routes/device.js";
import eventRoute from "./routes/event.js";
import cors from "cors";

const app = express()
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        logger.info('Connected to mongoDB.')
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", () => {
    logger.info('mongoDB disconnected!')
});

mongoose.connection.on("connected", () => {
    logger.info('mongoDB connected!')
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/attend", attendRoute);
app.use("/api/summary", summaryRoute);
app.use("/api/device", deviceRoute);
app.use("/api/event", eventRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });

app.listen(8800, () => {
  connect()
  logger.info('Connected to backend.')
});