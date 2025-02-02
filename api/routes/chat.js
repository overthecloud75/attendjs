import express from 'express'
import { chatCompletion } from '../controllers/chat.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/completion', verifyUser, chatCompletion)

export default router