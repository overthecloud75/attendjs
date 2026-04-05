import express from 'express'
import { executeCommand, getHistory, deleteHistory } from '../controllers/agent.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/command', verifyUser, executeCommand)
router.get('/history', verifyUser, getHistory)
router.delete('/history/:id', verifyUser, deleteHistory)

export default router
