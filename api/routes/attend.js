import express from 'express'
import { searchAttend } from '../controllers/attend.js'

const router = express.Router()

router.get('/search', searchAttend)

export default router