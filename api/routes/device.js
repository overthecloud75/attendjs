import express from 'express'
import { search, update } from '../controllers/device.js'
import { verifyIP } from '../utils/verifyToken.js'

const router = express.Router();

router.get('/search', verifyIP, search)
router.post('/update', verifyIP, update)

export default router;