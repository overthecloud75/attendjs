import Approval from '../models/Approval.js'
import Upload from '../models/Upload.js'
import Payment from '../models/Payment.js'
import { isValidObjectId } from '../models/utils.js'
import { getEmployeeByEmail } from './employee.js'
import { getApprover, getConsenter, makeHtml } from './event.js'
import { sanitizeData } from '../utils/util.js'
import { paymentRequestEmail, paymentConfirmationEmail } from '../utils/email.js'
import { fillPaymentExcelTemplate } from '../utils/xls.js'
import { getImageId } from '../utils/image.js'
import { createError } from '../utils/error.js'

const APPROVAL_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'InProgress',
    ACTIVE: 'Active',
    CANCEL: 'Cancel'
}

export const update = async (req, res, next) => {
    try {
        const { _id, status } = req.body
        if (!_id) throw createError(404, 'Approval not found!')

        const approval = await Approval.findOne({ _id })
        if (!approval) throw createError(404, 'Approval not found!')

        if (approval.status === status || approval.status === APPROVAL_STATUS.CANCEL) {
            throw createError(400, 'Invalid status change')
        }

        const updateResult = await updateApprovalStatus(approval, status, req.user.email)
        if (!updateResult.success) {
            throw createError(400, updateResult.message)
        }
        res.status(200).json(approval)     
    } catch (err) {
        next(err)
    }
}

const updateApprovalStatus = async (approval, newStatus, userEmail) => {
    if (userEmail === approval.approverEmail) {
        if (newStatus === APPROVAL_STATUS.CANCEL) {
            await makePaymentCancel(approval)
        } else if (approval.status === APPROVAL_STATUS.PENDING && newStatus === APPROVAL_STATUS.IN_PROGRESS) {
            await makePaymentInProgress(approval)
        } else {
            return { success: false, message: 'Invalid status change for approver' }
        }
    } else if (userEmail === approval.consenterEmail) {
        if (newStatus === APPROVAL_STATUS.CANCEL) {
            await makePaymentCancel(approval)
        } else if (approval.status === APPROVAL_STATUS.IN_PROGRESS && newStatus === APPROVAL_STATUS.ACTIVE) {
            await makePaymentActive(approval)
        } else {
            return { success: false, message: 'Invalid status change for consenter' }
        }
    } else if (approval.status !== APPROVAL_STATUS.ACTIVE && newStatus === APPROVAL_STATUS.CANCEL) {
        await makePaymentCancel(approval)
    } else {
        return { success: false, message: 'Unauthorized status change' }
    }

    approval.status = newStatus
    return { success: true }
}

export const getPayment = async (req, res, next) => {
    /* 
        1. apporover 확인 
    */
    try {
        const employee = await getEmployeeByEmail(req.user.email)
        const approverWithEmployeeId = await getApprover(employee)
        const {employeeId, ...approver} = approverWithEmployeeId
        const consenter = await getConsenter(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({approver, consenter})
    } catch (err) {
        next(err)
    }
}

export const postPayment = async (req, res, next) => {
    /* 
        1. approval 내용 저장 
        2. content의 imagePath 및 id 확인 
        3. 개인경비 청구서 excel 작성 
        4. paymentReqeustEmail 송부 
    */
    try {
        const { reason, etc, cardNo, content, start: startStr } = req.body
        const start = sanitizeData(startStr, 'date')
        const end = start
        const employee = await getEmployeeByEmail(req.user.email)
        const approver = await getApprover(employee)
        const consenter = await getConsenter(employee)
        const checkTheSameApproval = await Approval.findOne({email: req.user.email, start, end, reason, etc})
        if (checkTheSameApproval && checkTheSameApproval.status !==  APPROVAL_STATUS.CANCEL) {
            res.status(200).send('Already there is the same approval.')
        } 

        let approval = {approvalType: 'payment', employeeId: employee.employeeId, name: employee.name, email: employee.email, department: employee.department, start, end, cardNo, reason, etc, approverName: approver.name, approverEmail: approver.email, consenterName: consenter.name, consenterEmail: consenter.email, content}
        const imageId = getImageId(approval.content) 

        if (!imageId) throw createError(400, 'Image is missing')

        const uploadImage = await Upload.findOne({_id: imageId}) 
        const {destination, fileName} = await fillPaymentExcelTemplate(approval, uploadImage)
        const newPayment = new Payment({employeeId: approval.employeeId, destination, fileName})
        const payment = await newPayment.save()

        approval.paymentId = payment._id
        const newApproval = new Approval(approval)
        await newApproval.save()
        await paymentRequestEmail(newApproval, newApproval.status, payment)

        res.status(200).send('Event has been created.')
    } catch (err) {
        next(err)
    }
}

export const paymentApproval = async (req, res, next) => {
    /* 
        1. _id, _order 확인
    */
    try {
        const { _id, _order } = req.params
        if (!isValidObjectId(_id)) throw createError(404, 'approval not found!')
        const approval = await Approval.findOne({_id})
        if (!approval) throw createError(403, 'approval not found!')
        if (approval.status === APPROVAL_STATUS.PENDING && _order === '0'){
            const result = await makePaymentInProgress(approval)
            res.status(200).send(makeHtml(result.msg))
        } else if (approval.status === APPROVAL_STATUS.IN_PROGRESS && _order === '1') {
            const result = await makePaymentActive(approval)
            res.status(200).send(makeHtml(result.msg))
        } else {
            res.status(200).send(makeHtml('이미 처리하였습니다.'))
        }
    } catch (err) {
        next(err)
    }
}

export const paymentCancel = async (req, res, next) => {
    try {
        const{ _id } = req.params
        if (!isValidObjectId(_id)) throw createError(404, 'approval not found!')
        const approval = await Approval.findOne({_id})
        if (!approval) return next(createError(404, 'approval not found!'))
        if (approval.status !== APPROVAL_STATUS.ACTIVE){
            const result = await makePaymentCancel(approval)
            res.status(200).send(makeHtml(result.msg))
        } else {
            res.status(200).send(makeHtml('이미 처리하였습니다.'))
        }
    } catch (err) {
        next(err)
    }
}

export const makePaymentActive = async (approval) => {
    const status = APPROVAL_STATUS.ACTIVE
    const msg = '승인하였습니다.'
    await Approval.updateOne({_id: approval._id}, {$set: {status}}, {runValidators: true})
    await paymentConfirmationEmail(approval, status) // 합의자 승인 후 요청자에게 메일 송부 
    return {status, msg}
}

export const makePaymentCancel = async (approval) => {
    const status = APPROVAL_STATUS.CANCEL
    const msg = '취소하였습니다.'
    await Approval.updateOne({_id: approval._id}, {$set: {status}}, {runValidators: true})
    await paymentConfirmationEmail(approval, status) // 반려 후 요청자에게 메일 송부 
    return {status, msg}
}

export const makePaymentInProgress = async (approval) => {
    const status = approval.status === APPROVAL_STATUS.PENDING ? APPROVAL_STATUS.IN_PROGRESS : APPROVAL_STATUS.ACTIVE
    const msg = '승인하였습니다.'
    await Approval.updateOne({_id: approval._id}, {$set: {status}}, {runValidators: true})
    const payment = await Payment.findOne({_id: approval.paymentId})
    await paymentRequestEmail(approval, status, payment) // 승인 후 합의권자에게 메일 송부 
    return {status, msg}
}


