import { logger, reqFormat } from '../config/winston.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name 
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        res.status(200).setHeader('csrftoken', req.csrfToken()).json([])
    } catch (err) {
        next(err)
    }
}