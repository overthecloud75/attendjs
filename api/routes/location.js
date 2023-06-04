import express from 'express'
import { search, update } from '../controllers/location.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/update', verifyAdmin, update)

export default router