import express from "express";
import { getEventsInCalendar, getApproval, postApproval, confirmApproval, confirmCancel } from "../controllers/event.js";
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/', verifyUser, getEventsInCalendar)
router.get('/approval', verifyUser, getApproval)
router.post('/approval', verifyUser, postApproval)
router.get('/confirm/approval/:_id', confirmApproval)
router.get('/confirm/cancel/:_id', confirmCancel)

export default router