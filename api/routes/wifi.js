import express from 'express'
import { search } from '../controllers/wifi.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)

export default router