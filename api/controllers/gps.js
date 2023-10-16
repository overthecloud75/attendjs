import { logger, reqFormat } from '../config/winston.js'
import Login from '../models/GPSOn.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')

        let attends 
        if (name) {
            attends = await Login.find({name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1})
        } else { 
            attends = await Login.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(attends)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}
