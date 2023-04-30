import { logger, reqFormat } from '../config/winston.js'
import Report from "../models/Report.js"
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name 
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        let attends
        // [문제] endDate: 이름 검색시에만 실행
        if (name && name !== '') {
            attends = await Report.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1})       
        } else { 
            attends = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(attends)
    } catch (err) {
        next(err)
    }
}
