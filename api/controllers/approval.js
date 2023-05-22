import { logger, reqFormat } from '../config/winston.js'
import Approval from '../models/Approval.js'
// import { deleteEvent } from './event.js'
// import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        let approvalHistory
        if (req.user.isAdmin) {
            approvalHistory = await Approval.find({}).sort({createdAt: -1})
        } else { 
            approvalHistory = await Approval.find({email: req.user.email}).sort({createdAt: -1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(approvalHistory)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const update = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const confirmationCode = req.body.confirmationCode
        const status = req.body.status
        const approval = await Approval.findOne({confirmationCode})
        if (approval) {
            await Approval.updateOne({confirmationCode}, {$set: {reason: req.body.reason, etc: req.body.etc, status}}, {upsert: true})
            if (status==='Cancel') {
                // To Do 
            }
        }
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}