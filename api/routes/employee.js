import express from 'express'
import { search, update } from '../controllers/employee.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', search)
router.post('/update', verifyAdmin, update)

export default router