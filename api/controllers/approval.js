import { logger, reqFormat } from '../config/winston.js'
import Approval from '../models/Approval.js'
import { makeActive, makeCancel } from './event.js'
import { getToday } from '../utils/util.js'
// import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const approvalHistory = await getApprovalHistory(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(approvalHistory)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const update = async (req,res,next) => {
    logger.info(reqFormat(req))
    console.log('user', req.user)
    try {
        const confirmationCode = req.body.confirmationCode
        const status = req.body.status
        let approval = await Approval.findOne({confirmationCode})
        if (approval) {
            const today = getToday()
            if (req.user.isAdmin) {
                if ((approval.status === 'Pending' || approval.status === 'Active') && status === 'Cancel') {
                    await makeCancel(approval, confirmationCode)
                    approval.status = 'Cancel'
                } else if (approval.status === 'Pending' && status === 'Active') {
                    await makeActive(approval, confirmationCode)
                    approval.status = 'Active'
                } 
            } else if ((approval.status ==='Pending' && status === 'Cancel') ||
                (approval.status ==='Active' && status === 'Cancel' && approval.start > today)) {
                await makeCancel(approval, confirmationCode)
                approval.status = 'Cancel'
            } 
        }
        res.status(200).json(approval)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

const getApprovalHistory = async (req) => {
    let approvalHistory
    if (req.user.isAdmin) {
        approvalHistory = await Approval.find({}).sort({createdAt: -1}).limit(200)
    } else { 
        approvalHistory = await Approval.find({email: req.user.email}).sort({createdAt: -1}).limit(200)
    }
    return approvalHistory
}