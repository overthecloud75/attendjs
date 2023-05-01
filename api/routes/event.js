import express from "express";
import { getEvents, addEvent, deleteEvent, getApprove, postApprove, confirmApprove, confirmCancel } from "../controllers/event.js";
import { verifyUser, verifyIP } from '../utils/verifyToken.js'

const router = express.Router();

router.get('/', verifyIP, getEvents)
router.post('/add', verifyIP, addEvent)
router.post('/delete', verifyIP, deleteEvent)
router.get('/approve', verifyUser, getApprove)
router.post('/approve', verifyUser, postApprove)
router.get('/confirm/approve/:confirmationCode', confirmApprove)
router.get('/confirm/cancel/:confirmationCode', confirmCancel)

export default router