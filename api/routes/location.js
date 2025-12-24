import express from 'express'
import { search, update, write, deleteLocation } from '../controllers/location.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/update', verifyAdmin, update)
router.post('/write', verifyAdmin, write)
router.post('/delete', verifyAdmin, deleteLocation)

export default router