import express from 'express'
import { getPayment, postPayment, paymentApproval, paymentCancel } from '../controllers/payment.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/', verifyUser, getPayment)
router.post('/', verifyUser, postPayment)
router.get('/confirm/approval/:_id/:_order', paymentApproval)
router.get('/confirm/cancel/:_id/:_order', paymentCancel)

export default router