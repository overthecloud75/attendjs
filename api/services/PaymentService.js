import Approval from '../models/Approval.js'
import Payment from '../models/Payment.js'
import Upload from '../models/Upload.js'
import { sendPaymentRequestEmail, sendPaymentConfirmationEmail } from '../utils/email.js'
import { fillPaymentExcelTemplate } from '../utils/xls.js'
import { getImageId } from '../utils/image.js'
import { createError } from '../utils/error.js'
import { APPROVAL_STATUS } from '../config/domain.js'

/**
 * Service Layer for Expense/Payment Approvals
 */
export default class PaymentService {
    static APPROVAL_STATUS = APPROVAL_STATUS

    /**
     * Handles the creation of a new payment request
     */
    static async createPaymentRequest(employee, approver, consenter, body) {
        const { reason, etc, cardNo, content, start } = body
        const end = start

        const checkTheSameApproval = await Approval.findOne({
            email: employee.email, 
            start, 
            end, 
            reason, 
            etc
        })

        if (checkTheSameApproval && checkTheSameApproval.status !== this.APPROVAL_STATUS.CANCEL) {
            return { success: false, message: 'Already there is the same approval.' }
        }

        let approvalData = {
            approvalType: 'payment',
            employeeId: employee.employeeId,
            name: employee.name,
            email: employee.email,
            department: employee.department,
            start,
            end,
            cardNo,
            reason,
            etc,
            approverName: approver.name,
            approverEmail: approver.email,
            consenterName: consenter.name,
            consenterEmail: consenter.email,
            content,
            price: body.price || 0
        }

        const imageId = getImageId(approvalData.content)
        if (!imageId) throw createError(400, 'Image is missing')

        const uploadImage = await Upload.findById(imageId)
        const { destination, fileName } = await fillPaymentExcelTemplate(approvalData, uploadImage)
        
        const newPayment = new Payment({ 
            employeeId: approvalData.employeeId, 
            destination, 
            fileName 
        })
        const payment = await newPayment.save()

        approvalData.paymentId = payment._id
        const newApproval = new Approval(approvalData)
        await newApproval.save()
        
        await sendPaymentRequestEmail(newApproval, newApproval.status, payment)
        return { success: true, approval: newApproval }
    }

    /**
     * Logic for processing 1st and 2nd stage approvals
     */
    static async processApprovalStage(approval, order) {
        let result, title

        if (approval.status === this.APPROVAL_STATUS.PENDING && order === '0') {
            result = await this.makePaymentInProgress(approval)
            title = '결제 진행 중으로 변경되었습니다.'
        } 
        else if (approval.status === this.APPROVAL_STATUS.IN_PROGRESS && order === '1') {
            result = await this.makePaymentActive(approval)
            title = '결제가 완료되었습니다.'
        } 
        else {
            return { valid: false, message: '이미 처리된 결제입니다.' }
        }

        return { valid: true, title, msg: result.msg }
    }

    static async makePaymentActive(approval) {
        const status = this.APPROVAL_STATUS.ACTIVE
        await Approval.updateOne({ _id: approval._id }, { $set: { status } }, { runValidators: true })
        await sendPaymentConfirmationEmail(approval, status)
        return { status, msg: '승인하였습니다.' }
    }

    static async makePaymentCancel(approval) {
        const status = this.APPROVAL_STATUS.CANCEL
        await Approval.updateOne({ _id: approval._id }, { $set: { status } }, { runValidators: true })
        await sendPaymentConfirmationEmail(approval, status)
        return { status, msg: '취소하였습니다.' }
    }

    static async makePaymentInProgress(approval) {
        const status = this.APPROVAL_STATUS.IN_PROGRESS
        await Approval.updateOne({ _id: approval._id }, { $set: { status } }, { runValidators: true })
        const payment = await Payment.findById(approval.paymentId)
        await sendPaymentRequestEmail(approval, status, payment)
        return { status, msg: '승인하였습니다.' }
    }
}
