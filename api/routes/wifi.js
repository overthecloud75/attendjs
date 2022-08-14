import express from 'express'
import { searchWifi } from '../controllers/wifi.js'

const router = express.Router()

router.get('/search', searchWifi)

export default router