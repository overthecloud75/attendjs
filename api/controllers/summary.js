import { logger, reqFormat } from '../config/winston.js'
import Report from '../models/Report.js'
import { WORKING, getReverseStatus } from '../config/WORKING.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next)=>{
    logger.info(reqFormat(req))
    try {
        const name = req.query.name 
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        const reverseStatus = getReverseStatus()
        let attends
        let summaryList = []
        let summary = {}
        if (name && name !== '') {
            attends = await Report.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1}).lean()
        }
        else { 
            attends = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1}).lean();
        }; 
        for (const attend of attends) {
            if (!Object.keys(summary).includes(String(attend.employeeId))) {
                summary[attend.employeeId] = {
                    employeeId: attend.employeeId, 
                    name: attend.name, 
                    days: 0,
                    workingHours: 0
                }
                for (const inStatus of WORKING.inStatus){
                    summary[attend.employeeId][inStatus] = 0 
                }
                for (const outStatus of Object.keys(WORKING.outStatus)){
                    summary[attend.employeeId][outStatus] = 0 
                }
            }
            summary[attend.employeeId].days = summary[attend.employeeId].days + 1  
            summary[attend.employeeId].workingHours = summary[attend.employeeId].workingHours + attend.workingHours
            if (attend.status) {
                summary[attend.employeeId][attend.status] = summary[attend.employeeId][attend.status] + 1
            }
            if (attend.reason) {
                summary[attend.employeeId][reverseStatus[attend.reason]] = summary[attend.employeeId][reverseStatus[attend.reason]] + 1
            }
        }
        for (const id of Object.keys(summary)) {
            summary[id].workingHours = Math.round(summary[id].workingHours * 10) / 10
            summary[id].workingDays = summary[id].days
            for (const key of Object.keys(summary[id])) {
                if (Object.keys(WORKING.offDay).includes(key)) {
                    summary[id].workingDays = summary[id].workingDays - summary[id][key] * WORKING.offDay[key]
                }
            }
            summary[id].workingDays = Math.round(summary[id].workingDays * 100) / 100
            summaryList.push(summary[id])
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList);
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}


