import express from 'express'
import { search } from '../controllers/report.js'
import { verifyIP } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyIP, search)

export default router