import express from 'express'
import { update, getPayment, postPayment, paymentApproval, paymentCancel } from '../controllers/paymentApproval.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/', verifyUser, getPayment)
router.post('/', verifyUser, postPayment)
router.post('/update', verifyUser, update)
router.get('/confirm/approval/:_id/:_order', paymentApproval)
router.get('/confirm/cancel/:_id/:_order', paymentCancel)

export default router