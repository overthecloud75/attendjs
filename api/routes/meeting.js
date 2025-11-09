import express from 'express'
import { getMeetings, addMeeting, deleteMeeting } from '../controllers/meeting.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/', verifyUser, getMeetings)
router.post('/add', verifyUser, addMeeting)
router.post('/delete', verifyAdmin, deleteMeeting)

export default router
