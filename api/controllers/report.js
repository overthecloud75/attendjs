import Report from "../models/Report.js"
import Employee from "../models/Employee.js"
import { WORKING } from "../config/WORKING.js"
import { getToday } from "../utils/util.js"

const seperateEvent = (action, event) => {
    const name = event.split('/')[0]
    const eventCandidate = event.split('/')[1]
    let eventStatus 
    if (action === 'add') {
        eventStatus = '기타'
        for (let status of Object.keys(WORKING.status)) {
            if (eventCandidate.includes(status)) {
                eventStatus = status 
                if (status === '반차') {
                    break 
                }
            }
        }
    }
    else {
        eventStatus = null
    }
    return {name, eventStatus}
}

const getState = (employeeStatus, begin, end) => {
    let state = null
    if (employeeStatus === '상근') {
        if (begin) {
            if (begin <= WORKING.time.beginTime) { state = '정상출근' }
            else { state = '지각' }
        }
        else { state = '미출근' }
    }  
    return state 
}

export const calculateWorkingHours = (begin, end) => {
    let workingHours = 0 
    if (begin) {
        workingHours = (Number(end.substring(0, 2)) - Number(begin.substring(0,2))) + (Number(end.substring(2,4)) - Number(begin.substring(2,4))) / 60
        if (begin > end) {
            workingHours = workingHours + 24
            if (Number(WORKING.time.lunchTime) > Number(begin)) {
                workingHours = workingHours - 1
            }
        }
        else {
            if (Number(end) > Number(WORKING.time.lunchFinishTime) && Number(WORKING.time.lunchFinishTime) > Number(begin)) {
                workingHours = workingHours - 1
            }
        }
        workingHours = Math.round(workingHours * 10) / 10
    }
    return workingHours
}

export const reportUpdate = async (action, event, start, end) => {
    const {name, eventStatus} = seperateEvent(action, event)
    const employee = await Employee.findOne({name}).lean()
    const today = getToday()
    if (employee) {
        const employeeId = employee.employeeId
        const reports = await Report.find({name, employeeId, date: {$gte: start, $lt: end}}).lean()
        let reason = null 
        if (Object.keys(WORKING.status).includes(employee.mode)) {
            reason = employee.mode 
        }
        if (eventStatus) {reason = eventStatus}
        for (let report of reports) {
            const date = report.date 
            if (date < today) {
                report.reason = reason
                if (reason) {
                    report.workingHours = WORKING.status[reason]
                    report.status = null 
                }
                else {
                    report.workingHours = calculateWorkingHours(report.begin, report.end)
                    report.state = getState(employee.status, report.begin, report.end)
                }
            }
            await Report.updateOne({name, employeeId, date}, {$set: report})
        }
    } 
}