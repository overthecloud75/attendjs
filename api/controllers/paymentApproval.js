import Approval from '../models/Approval.js'
import { isValidObjectId } from '../models/utils.js'
import EmployeeService from '../services/EmployeeService.js'
import EventService from '../services/EventService.js'
import PaymentService from '../services/PaymentService.js'
import { sanitizeData } from '../utils/util.js'
import { createError } from '../utils/error.js'
import { renderSimpleMessage } from '../utils/htmlTemplate.js'

const { APPROVAL_STATUS } = PaymentService

export const update = async (req, res, next) => {
    try {
        const { _id, status } = req.body
        if (!isValidObjectId(_id)) throw createError(404, 'Approval not found!')

        const approval = await Approval.findById(_id)
        if (!approval) throw createError(404, 'Approval not found!')

        if (approval.status === status || approval.status === APPROVAL_STATUS.CANCEL) {
            throw createError(400, 'Invalid status change')
        }

        const updateResult = await handleStatusUpdate(approval, status, req.user.email)
        if (!updateResult.success) {
            throw createError(400, updateResult.message)
        }
        res.status(200).json(approval)     
    } catch (err) {
        next(err)
    }
}

/**
 * Controller-specific routing for manual status updates (approver vs consenter)
 */
async function handleStatusUpdate(approval, newStatus, userEmail) {
    if (userEmail === approval.approverEmail) {
        if (newStatus === APPROVAL_STATUS.CANCEL) {
            await PaymentService.makePaymentCancel(approval)
        } else if (approval.status === APPROVAL_STATUS.PENDING && newStatus === APPROVAL_STATUS.IN_PROGRESS) {
            await PaymentService.makePaymentInProgress(approval)
        } else {
            return { success: false, message: 'Invalid status change for approver' }
        }
    } else if (userEmail === approval.consenterEmail) {
        if (newStatus === APPROVAL_STATUS.CANCEL) {
            await PaymentService.makePaymentCancel(approval)
        } else if (approval.status === APPROVAL_STATUS.IN_PROGRESS && newStatus === APPROVAL_STATUS.ACTIVE) {
            await PaymentService.makePaymentActive(approval)
        } else {
            return { success: false, message: 'Invalid status change for consenter' }
        }
    } else if (approval.status !== APPROVAL_STATUS.ACTIVE && newStatus === APPROVAL_STATUS.CANCEL) {
        await PaymentService.makePaymentCancel(approval)
    } else {
        return { success: false, message: 'Unauthorized status change' }
    }

    approval.status = newStatus
    return { success: true }
}

export const getPayment = async (req, res, next) => {
    try {
        const employee = await EmployeeService.getEmployeeByEmail(req.user.email)
        const approverWithEmployeeId = await EventService.getApprover(employee)
        const { employeeId, ...approver } = approverWithEmployeeId
        const consenter = await EventService.getConsenter(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({ approver, consenter })
    } catch (err) {
        next(err)
    }
}

export const postPayment = async (req, res, next) => {
    try {
        const start = sanitizeData(req.body.start, 'date')
        const email = req.user.email
        
        const employee = await EmployeeService.getEmployeeByEmail(email)
        const approver = await EventService.getApprover(employee)
        const consenter = await EventService.getConsenter(employee)
        
        const result = await PaymentService.createPaymentRequest(employee, approver, consenter, { ...req.body, start })
        
        if (!result.success) {
            return res.status(200).send(result.message)
        }

        res.status(200).send('Event has been created.')
    } catch (err) {
        next(err)
    }
}

export const paymentApproval = async (req, res, next) => {
    try {
        const { _id, _order } = req.params
        if (!isValidObjectId(_id)) throw createError(400, 'Invalid ID format.')

        const approval = await Approval.findById(_id)
        if (!approval) throw createError(404, 'Approval not found.')

        const result = await PaymentService.processApprovalStage(approval, _order)
        
        if (!result.valid) {
            return res.status(200).send(renderSimpleMessage('이미 처리된 결제입니다.', '이 결제 요청은 더 이상 유효하지 않습니다.'))
        }

        return res.status(200).send(renderSimpleMessage(result.title, result.msg))
    } catch (err) {
        next(err)
    }
}

export const paymentCancel = async (req, res, next) => {
    try {
        const { _id } = req.params
        if (!isValidObjectId(_id)) throw createError(400, 'Invalid ID format.')

        const approval = await Approval.findById(_id)
        if (!approval) throw createError(404, 'Approval not found.')

        if (approval.status === APPROVAL_STATUS.ACTIVE) {
            return res.status(200).send(renderSimpleMessage('이미 처리된 결제입니다.', '완료된 결제는 취소할 수 없습니다.'))
        }

        const result = await PaymentService.makePaymentCancel(approval)
        return res.status(200).send(renderSimpleMessage('결제가 취소되었습니다.', result.msg))
    } catch (err) {
        next(err)
    }
}
