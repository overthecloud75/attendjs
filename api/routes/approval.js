import express from 'express'
import { search, update } from '../controllers/approval.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/update', verifyAdmin, update)

export default router