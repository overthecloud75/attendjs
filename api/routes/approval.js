import express from 'express'
import { search, update } from '../controllers/approval.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/update', verifyUser, update)

export default router