import express from 'express'
import { search, write, update, deleteCreditCard } from '../controllers/creditcard.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/update', verifyUser, update)
router.post('/write', verifyUser, write)
router.post('/delete', verifyAdmin, deleteCreditCard)

export default router