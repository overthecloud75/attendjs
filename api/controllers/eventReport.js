import Report from '../models/Report.js'
import Employee from '../models/Employee.js'
import { WORKING } from '../config/working.js'
import { getToday } from '../utils/util.js'

const EMPLOYEE_STATUS = {
    FULL_TIME: '상근'
}

const ATTENDANCE_STATE = {
    NORMAL: '정상출근',
    LATE: '지각',
    ABSENT: '미출근'
}

const seperateEvent = (action, event) => {
    const [name, eventCandidate] = event.split('/')
    if (action !== 'add') return { name, eventStatus: null }
    
    let eventStatus = '기타'
    for (let status in WORKING.status) {
        if (eventCandidate.includes(status)) {
            eventStatus = status 
            if (status === '반차') break 
        }
    }
   
    return {name, eventStatus}
}

const getState = (employeeStatus, begin, end) => {
    if (employeeStatus !== EMPLOYEE_STATUS.FULL_TIME) return null
    if (!begin) return ATTENDANCE_STATE.ABSENT
    return begin <= WORKING.time.beginTime ? ATTENDANCE_STATE.NORMAL : ATTENDANCE_STATE.LATE
}

export const calculateWorkingHours = (begin, end) => {
    if (!begin) return 0
    let workingHours = (Number(end.substring(0, 2)) - Number(begin.substring(0,2))) + (Number(end.substring(2,4)) - Number(begin.substring(2,4))) / 60
    if (begin > end) {
        workingHours = workingHours + 24
        if (Number(WORKING.time.lunchTime) > Number(begin)) {
            workingHours = workingHours - 1
        }
    } else if (Number(end) > Number(WORKING.time.lunchFinishTime) && Number(WORKING.time.lunchFinishTime) > Number(begin)) {
        workingHours = workingHours - 1
    }
    return Math.round(workingHours * 10) / 10
}

export const reportUpdate = async (action, event, start, end) => {
    // event 정보 name과 eventStatus로 parsing 
    const {name, eventStatus} = seperateEvent(action, event)
    const employee = await Employee.findOne({name})
    const today = getToday()
    if (!employee) throw createError(404, 'Employee not found')
    const { employeeId, status } = employee
    const reports = await Report.find({name, employeeId, date: {$gte: start, $lt: end}}).sort({date: 1})
    for (const report of reports) {
        const { date } = report 
        if (date >= today) break

        const updatedReport = await updateReport(report, eventStatus, status)
        if (updatedReport) {
            await Report.updateOne({ name, employeeId, date: report.date }, { $set: updatedReport }, { runValidators: true })
        }
    }
}

const updateReport = async (report, eventStatus, employeeStatus) => {
    if (eventStatus === '출근' && report.reason) return null

    const updatedReport = { ...report }
    updatedReport.reason = eventStatus

    if (eventStatus) {
        updatedReport.workingHours = WORKING.status[eventStatus]
        updatedReport.status = null
    } else {
        updatedReport.workingHours = calculateWorkingHours(report.begin, report.end)
        updatedReport.state = getState(employeeStatus, report.begin, report.end)
    }

    return updatedReport
}