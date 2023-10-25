import Report from "../models/Report.js"
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    try {
        const attends = await getAttends(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(attends)
    } catch (err) {
        next(err)
    }
}

export const getAttends = async (req) => {
    const name = req.query.name 
    const startDate = sanitizeData(req.query.startDate, 'date')
    const endDate = sanitizeData(req.query.endDate, 'date')
    
    let attends
    if (name) {
        attends = await Report.find({name, date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
    } else { 
        attends = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
    }
    return attends
}


