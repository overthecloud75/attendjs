import Report from "../models/Report.js"
import Employee from "../models/Employee.js"
import { calculateWorkingHours } from "./report.js"

const randomAttend = (range, add) => {
    let time = Math.floor(range * Math.random() + add)
    let strTime 
    if (time >= 10) {
        strTime = String(time)
    }   
    else {strTime = '0'+ String(time)}
    return strTime
}

export const searchAttend = async (req,res,next) => {
    try {
        const name = req.query.name 
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let attends
        if (name && name !== '') {
            const employee = await Employee.findOne({name}).lean()
            if (employee.regular === '병특') {
                attends = await Report.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1}).lean()
                for (let attend of attends) {
                    if (attend.reason === '파견') {
                        attend.reason = null
                        attend.begin = '08' + randomAttend(30, 30) + randomAttend(60, 0)
                        attend.end = '18' + randomAttend(60, 0) + randomAttend(60, 0)
                        attend.workingHours = calculateWorkingHours(attend.begin, attend.end)
                    }
                }
            }
            else {
                attends = await Report.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1})
            }
        }
        else { 
            attends = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1});
        }; 
        res.status(200).json(attends);
    } catch (err) {
        next(err);
    }
}
