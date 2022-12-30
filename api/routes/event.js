import express from "express";
import { getEvents, addEvent, deleteEvent } from "../controllers/event.js";
import { verifyIP } from '../utils/verifyToken.js'

const router = express.Router();

router.get('/', verifyIP, getEvents)
router.post('/add', verifyIP, addEvent)
router.post('/delete', verifyIP, deleteEvent)

export default router;