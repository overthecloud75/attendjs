import express from 'express'
import { search, update } from '../controllers/device.js'

const router = express.Router();

router.get('/search', search)
router.post('/update', update)

export default router;