import express from 'express'
import { searchDevice } from '../controllers/device.js'

const router = express.Router();

router.get('/search', searchDevice)

export default router;