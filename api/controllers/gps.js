import Login from '../models/GPSOn.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req, res, next) => {
    try {
        const { name, startDate: startDateStr, endDate: endDateStr } = req.query
        const startDate = sanitizeData(startDateStr, 'date')
        const endDate = sanitizeData(endDateStr, 'date')

        let attends 
        if (name) {
            attends = await Login.find({name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1})
        } else { 
            attends = await Login.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(attends)
    } catch (err) {
        next(err)
    }
}
