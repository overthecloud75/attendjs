import { logger, reqFormat } from '../config/winston.js'
import Report from "../models/Report.js"
import Employee from "../models/Employee.js"
import { calculateWorkingHours } from "./eventReport.js"
import { sanitizeData } from '../utils/util.js'

const randomAttend = (range, add) => {
    let time = Math.floor(range * Math.random() + add)
    let strTime 
    if (time >= 10) {
        strTime = String(time)
    }   
    else {strTime = '0'+ String(time)}
    return strTime
}

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name 
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        let attends
        // [문제] endDate: 이름 검색시에만 실행
        if (name && name !== '') {
            const employee = await Employee.findOne({name}).lean()
            if (employee.regular === '병특') {
                attends = await Report.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1}).lean()
                for (let attend of attends) {
                    if (attend.reason === '파견') {
                        attend.status = '정상출근'
                        attend.reason = null
                        attend.begin = '08' + randomAttend(30, 30) + randomAttend(60, 0)
                        attend.end = '18' + randomAttend(60, 0) + randomAttend(60, 0)
                        attend.workingHours = calculateWorkingHours(attend.begin, attend.end)
                    }
                }
            }
            else {
                attends = await Report.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1})
            }
        }
        else { 
            attends = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
        }; 
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(attends)
    } catch (err) {
        next(err)
    }
}
