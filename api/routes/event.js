import express from "express";
import { getEvents, addEvent, deleteEvent, getApproval, postApproval, confirmApproval, confirmCancel } from "../controllers/event.js";
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router();

router.get('/', verifyUser, getEvents)
router.post('/add', verifyAdmin, addEvent)
router.post('/delete', verifyAdmin, deleteEvent)
router.get('/approval', verifyUser, getApproval)
router.post('/approval', verifyUser, postApproval)
router.get('/confirm/approval/:confirmationCode', confirmApproval)
router.get('/confirm/cancel/:confirmationCode', confirmCancel)

export default router