import Approval from '../models/Approval.js'
import { isValidObjectId } from '../models/utils.js'
import { getEmployeeByEmail } from './employee.js'
import { getApprover, getConsenter, makeHtml } from './event.js'
import { sanitizeData } from '../utils/util.js'
import { paymentRequestEmail, paymentConfirmationEmail } from '../utils/email.js'
import { createError } from '../utils/error.js'

export const update = async (req, res, next) => {
    try {
        const _id = req.body._id
        const status = req.body.status
        if (!_id) return next(createError(404, 'Approval not found!'))
        let approval = await Approval.findOne({_id})
        if (!approval) return next(createError(404, 'Approval not found!'))
               
        if (approval.status === status || approval.status === 'Cancel') {
            return next(createError(400, 'Something wrong'))
        } else if (req.user.email === approval.approverEmail) {
            if (status === 'Cancel') {
                await makePaymentCancel(approval)
                approval.status = 'Cancel'
            } else if (approval.status === 'Pending' && status === 'InProgress') {
                await makePaymentInProgress(approval)
                approval.status = 'InProgress'
            } else {
                return next(createError(400, 'Something wrong'))
            }
        } else if (req.user.email === approval.consenterEmail) {
            if (status === 'Cancel') {
                await makePaymentCancel(approval)
                approval.status = 'Cancel'
            } else if (approval.status === 'InProgress' && status === 'Active') {
                await makePaymentActive(approval)
                approval.status = 'Active'
            } else {
                return next(createError(400, 'Something wrong'))
            }
        } else if (approval.status !=='Active' && status === 'Cancel') {
            await makePaymentCancel(approval)
            approval.status = 'Cancel'     
        } else {return next(createError(400, 'Something wrong'))}
        res.status(200).json(approval)     
    } catch (err) {
        next(err)
    }
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
        2. paymentReqeustEmail 송부 
    */
    try {
        const start = sanitizeData(req.body.start, 'date')
        const end = start
        const employee = await getEmployeeByEmail(req.user.email)
        const approver = await getApprover(employee)
        const consenter = await getConsenter(employee)
        const checkTheSameApproval = await Approval.findOne({email: req.user.email, start, end, reason: req.body.reason, etc: req.body.etc})
        if (checkTheSameApproval && checkTheSameApproval.status !== 'Cancel') {
            res.status(200).send('Already there is the same approval.')
        } else {
            const newApproval = new Approval({approvalType: 'payment', employeeId: employee.employeeId, name: employee.name, email: employee.email, department: employee.department, start, end, reason: req.body.reason, etc: req.body.etc, approverName: approver.name, approverEmail: approver.email, consenterName: consenter.name, consenterEmail: consenter.email, content: req.body.content})
            await newApproval.save()
            await paymentRequestEmail(newApproval, newApproval.status)
            res.status(200).send('Event has been created.')
        }
    } catch (err) {
        next(err)
    }
}

export const paymentApproval = async (req, res, next) => {
    /* 
        1. _id, _order 확인
    */
    try {
        const _id = req.params._id
        const _order = req.params._order
        if (isValidObjectId(_id)) {
            const approval = await Approval.findOne({_id})
            if (!approval) return next(createError(403, 'approval not found!'))
            if (approval.status === 'Pending' && _order === '0'){
                const result = await makePaymentInProgress(approval)
                res.status(200).send(makeHtml(result.msg))
            } else if (approval.status === 'InProgress' && _order === '1') {
                const result = await makePaymentActive(approval)
                res.status(200).send(makeHtml(result.msg))
            } else {
                res.status(200).send(makeHtml('이미 처리하였습니다.'))
            }
        } else {
            next(createError(500, 'approval not found!'))
        }
    } catch (err) {
        next(err)
    }
}

export const paymentCancel = async (req, res, next) => {
    try {
        const _id = req.params._id
        if (isValidObjectId(_id)) {
            const approval = await Approval.findOne({_id})
            if (!approval) return next(createError(404, 'approval not found!'))
            if (approval.status !== 'Active'){
                const result = await makePaymentCancel(approval)
                res.status(200).send(makeHtml(result.msg))
            } else {
                res.status(200).send(makeHtml('이미 처리하였습니다.'))
            }
        } else {
            next(createError(404, 'approval not found!'))
        }
    } catch (err) {
        next(err)
    }
}

export const makePaymentActive = async (approval) => {
    const status = 'Active'
    const msg = '승인하였습니다.'
    await Approval.updateOne({_id: approval._id}, {$set: {status}}, {runValidators: true})
    await paymentConfirmationEmail(approval, status) // 합의자 승인 후 요청자에게 메일 송부 
    return {status, msg}
}

export const makePaymentCancel = async (approval) => {
    const status = 'Cancel'
    const msg = '취소하였습니다.'
    await Approval.updateOne({_id: approval._id}, {$set: {status}}, {runValidators: true})
    await paymentConfirmationEmail(approval, status) // 반려 후 요청자에게 메일 송부 
    return {status, msg}
}

export const makePaymentInProgress = async (approval) => {
    let status
    if (approval.status === 'Pending') {status = 'InProgress'}
    else (status = 'Active')
    const msg = '승인하였습니다.'
    await Approval.updateOne({_id: approval._id}, {$set: {status}}, {runValidators: true})
    await paymentRequestEmail(approval, status) // 승인 후 합의권자에게 메일 송부 
    return {status, msg}
}


