import Approval from '../models/Approval.js'
import { makeActive, makeCancel } from './event.js'
import { getToday } from '../utils/util.js'
import { createError } from '../utils/error.js'
// import { sanitizeData } from '../utils/util.js'

const LIMIT = 200

const STATUS = {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    CANCEL: 'Cancel'
}

export const search = async (req, res, next) => {
    try {
        const approvalHistory = await getApprovalHistory(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(approvalHistory)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const { _id, status } = req.body
        if (!_id) return next(createError(404, 'Approval not found!'))
        const approval = await Approval.findOne({_id})
        if (!approval) return next(createError(404, 'Approval not found!'))
               
        const today = getToday()
        if (approval.status === status || approval.status === STATUS.CANCEL) {
            return next(createError(400, 'Invalid status change'))
        }   
        const updatedApproval = await updateApprovalStatus(approval, status, req.user.isAdmin)
        res.status(200).json(updatedApproval)
    } catch (err) {
        next(err)
    }
}

const updateApprovalStatus = async (approval, newStatus, isAdmin) => {
    const today = getToday()
    if (isAdmin) {
        if ((approval.status === STATUS.PENDING || approval.status === STATUS.ACTIVE) && newStatus === STATUS.CANCEL) {
            await makeCancel(approval)
            approval.status = STATUS.CANCEL
        } else if (approval.status === STATUS.PENDING && newStatus === STATUS.ACTIVE) {
            await makeActive(approval)
            approval.status = STATUS.ACTIVE
        } else {
            throw createError(400, 'Invalid status change for admin')
        }
    } else if ((approval.status === STATUS.PENDING && newStatus === STATUS.CANCEL) ||
               (approval.status === STATUS.ACTIVE && newStatus === STATUS.CANCEL && approval.start > today)) {
        await makeCancel(approval)
        approval.status = STATUS.CANCEL
    } else {
        throw createError(400, 'Invalid status change for user')
    }
    return approval
}

const getApprovalHistory = async (req) => {
    const { name } = req.query
    const { isAdmin, email } = req.user
    // const startDate = sanitizeData(req.query.startDate, 'date')
    // const endDate = sanitizeData(req.query.endDate, 'date')
    let query = {}
    if (isAdmin) {
        if (name) query.name = name
    } else {
        query.email = email
    }
    return Approval.find(query).sort({ createdAt: -1 }).limit(LIMIT)
}