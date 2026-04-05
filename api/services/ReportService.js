import Report from '../models/Report.js'
import Employee from '../models/Employee.js'
import { WORKING } from '../config/working.js'
import { DateUtil } from '../utils/util.js'
import { createError } from '../utils/error.js'
import { EMPLOYEE_STATUS, ATTENDANCE_STATE } from '../config/domain.js'

/**
 * Service Layer for Attendance Reports and Monthly Summaries
 */
export default class ReportService {
    static EMPLOYEE_STATUS = EMPLOYEE_STATUS
    static ATTENDANCE_STATE = ATTENDANCE_STATE


    /**
     * Bulk update reports based on an event (Active/Cancel)
     */
    static async reportUpdate(action, event, start, end) {
        // Parse event to get employee name and event status (e.g. '휴가', '반차')
        const { name, eventStatus } = this.seperateEvent(action, event)
        const employee = await Employee.findOne({ name })
        const today = DateUtil.today()
        
        if (!employee) throw createError(404, 'Employee not found')
        const { employeeId, status } = employee

        const reports = await Report.find({ 
            name, 
            employeeId, 
            date: { $gte: start, $lt: end } 
        }).sort({ date: 1 }).lean()

        for (const report of reports) {
            const { date } = report 
            // Do not update future reports
            if (date >= today) break
            
            const updatedReport = await this.updateReport(report, eventStatus, status)
            if (updatedReport) {
                await Report.updateOne(
                    { name, employeeId, date: report.date }, 
                    { $set: updatedReport }, 
                    { runValidators: true }
                )
            }
        }
    }

    /**
     * Internal logic for updating a single report document based on event status
     */
    static async updateReport(report, eventStatus, employeeStatus) {
        if (eventStatus === '출근' && report.reason) return null // fail proof
        
        const updatedReport = { ...report }
        updatedReport.reason = eventStatus

        if (eventStatus) {
            updatedReport.workingHours = WORKING.reason[eventStatus]
            updatedReport.status = null
        } else {
            updatedReport.workingHours = this.calculateWorkingHours(report.begin, report.end)
            updatedReport.state = this.getState(employeeStatus, report.begin, report.end)
        }
        return updatedReport
    }

    /**
     * Parses event strings like '홍길동/휴가'
     */
    static seperateEvent(action, event) {
        const [name, eventCandidate] = event.split('/')
        if (action !== 'add') return { name, eventStatus: null }
        
        let eventStatus = '기타'
        for (let reason in WORKING.reason) {
            if (eventCandidate.includes(reason)) {
                eventStatus = reason
                if (reason === '반차') break 
            }
        }
        return { name, eventStatus }
    }

    /**
     * Calculates the attendance state (Normal, Late, Absent)
     */
    static getState(employeeStatus, begin, end) {
        if (employeeStatus !== this.EMPLOYEE_STATUS.FULL_TIME) return null
        if (!begin) return this.ATTENDANCE_STATE.ABSENT
        return begin <= WORKING.time.beginTime ? this.ATTENDANCE_STATE.NORMAL : this.ATTENDANCE_STATE.LATE
    }

    /**
     * Calculates working hours from clock-in and clock-out times
     */
    static calculateWorkingHours(begin, end) {
        if (!begin) return 0
        let workingHours = (Number(end.substring(0, 2)) - Number(begin.substring(0, 2))) + 
                           (Number(end.substring(2, 4)) - Number(begin.substring(2, 4))) / 60
        
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
}
