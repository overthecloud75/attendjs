import { logger, reqFormat } from '../config/winston.js'
import Approval from '../models/Approval.js'
// import { deleteEvent } from './event.js'
import { makeActive, makeCancel } from './event.js'
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
    try {
        // let result 
        let msg = 'updated'
        const confirmationCode = req.body.confirmationCode
        const status = req.body.status
        const approval = await Approval.findOne({confirmationCode})
        if (approval) {
            if (req.user.isAdmin) {
                if (approval.status === 'Pending' && status === 'Cancel') {
                    await makeCancel(approval, confirmationCode)
                } else if (approval.status === 'Pending' && status === 'Active') {
                    await makeActive(approval, confirmationCode)
                } else { msg = 'not updated' }
            } else {
                if (approval.status ==='Pending' && status==='Cancel') {
                    await Approval.updateOne({confirmationCode}, {$set: {status}})
                } else if (approval.status ==='Active' && status==='Cancel') {
                    await Approval.updateOne({confirmationCode}, {$set: {status}})
                    // TO DO
                } else { msg = 'not updated' }
            }
        } else { msg = 'not updated' }
        res.status(200).json(msg)
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