import express from 'express'
import { confirmCode } from '../controllers/auth.js'

const router = express.Router()

router.get('/token/:confirmationCode', confirmCode)

export default router