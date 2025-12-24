import express from 'express'
import { verifyRegistrationCode } from '../controllers/auth.js'

const router = express.Router()

router.get('/token/:confirmationCode', verifyRegistrationCode)

export default router