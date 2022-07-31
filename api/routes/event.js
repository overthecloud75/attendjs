import express from "express";
import { getEvents, addEvent, deleteEvent } from "../controllers/event.js";

const router = express.Router();

router.get("/", getEvents)
router.post("/add", addEvent)
router.delete("/delete", deleteEvent)

export default router;