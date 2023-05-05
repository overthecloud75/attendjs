import { logger, reqFormat } from '../config/winston.js'
import Approval from '../models/Approval.js'
// import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        // const name = req.query.name
        // const startDate = sanitizeData(req.query.startDate, 'date')
        // const endDate = sanitizeData(req.query.endDate, 'date')
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