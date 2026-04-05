import Event from '../models/Event.js'
import Employee from '../models/Employee.js'
import Report from '../models/Report.js'
import Approval from '../models/Approval.js'
import { DateUtil } from '../utils/util.js'
import ReportService from './ReportService.js'
import { sendAttendConfirmationEmail } from '../utils/email.js'
import LeaveService from './LeaveService.js'
import EmployeeService from './EmployeeService.js'
import { APPROVAL_STATUS } from '../config/domain.js'

/**
 * Service Layer for Calendar Events and Approver Selection Logic
 */
export default class EventService {
    static APPROVAL_STATUS = APPROVAL_STATUS


    /**
     * Fetches events for the calendar based on the specified scope (private, company, team)
     */
    static async fetchEvents(start, end, option, user) {
        const baseQuery = { start: { $gte: start, $lt: end }, employeeId: { $exists: true } }
        let events = []
        let attendStatus = []
        const notExistEmployeeIdEvent = await Event.find({ ...baseQuery, employeeId: { $exists: false } }).sort({ start: 1 })

        switch (option) {
            case 'private':
                const employeeId = user.employeeId
                events = await Event.find({ ...baseQuery, employeeId }).sort({ start: 1 })
                attendStatus = await this.getEventFromStatus(start, employeeId)
                break
            case 'company':
                events = await Event.find(baseQuery).sort({ start: 1 })
                break
            case 'team':
                events = await Event.find({ ...baseQuery, department: user.department }).sort({ start: 1 })
                break
        }
        return [...events, ...notExistEmployeeIdEvent, ...attendStatus]
    }

    /**
     * Finds the designated approver for an employee according to the organizational hierarchy
     */
    static async getApprover(employee) {
        let approver
        switch (employee.position) {
            case '팀원':
                approver = await Employee.findOne({ position: '팀장', department: employee.department, regular: { $ne: EmployeeService.STATUS.RETIRED } })
                if (!approver) {
                    approver = await Employee.findOne({ position: '본부장', regular: { $ne: EmployeeService.STATUS.RETIRED } })
                }
                break
            case '팀장':
                approver = await Employee.findOne({ position: '본부장', regular: { $ne: EmployeeService.STATUS.RETIRED } })
                break
            case '본부장':
                approver = employee
                break
            case '대표이사':
                approver = employee
                break
            default:
                approver = await Employee.findOne({ position: '본부장', regular: { $ne: EmployeeService.STATUS.RETIRED } })
        }

        if (!approver) {
            approver = await Employee.findOne({ position: '대표이사', regular: { $ne: EmployeeService.STATUS.RETIRED } })
        }

        if (!approver) {
            approver = employee
        }

        return {
            name: approver.name,
            position: approver.position,
            department: approver.department,
            email: approver.email,
            employeeId: approver.employeeId
        }
    }

    /**
     * Finds the consenter (management team) for an employee
     */
    static async getConsenter(employee) {
        let consenter = await Employee.findOne({ position: '팀장', department: '관리팀', regular: { $ne: EmployeeService.STATUS.RETIRED } })
        if (!consenter) {
            consenter = await Employee.findOne({ position: '대표이사', regular: { $ne: EmployeeService.STATUS.RETIRED } })
        }
        return consenter
    }

    /**
     * Returns event-like objects representing attendance issues (Absent, Late) to be displayed on the calendar
     */
    static async getEventFromStatus(start, employeeId) {
        const today = DateUtil.today()
        let attendStatus = []
        if (start <= today) {
            const attends = await Report.find({
                date: { $gte: start, $lte: today },
                employeeId,
                status: { $in: ['미출근', '지각'] }
            }).sort({ date: 1 })

            for (const attend of attends) {
                attendStatus.push({
                    title: attend['status'],
                    start: attend['date'],
                    end: DateUtil.formatNextDay(attend['date'])
                })
            }
        }
        return attendStatus
    }

    /**
     * Helper to generate a standardized event title from an approval request
     */
    static makeTitle(approval) {
        return (approval.etc) ? (`${approval.name}/${approval.etc}`) : (`${approval.name}/${approval.reason}`)
    }

    /**
     * Approves a request and creates a corresponding calendar event
     */
    static async makeActive(approval) {
        const { _id, start, end } = approval
        let status
        let msg
        if (end >= start) {
            const title = this.makeTitle(approval)
            await this.makeEvent(title, approval)
            status = this.APPROVAL_STATUS.ACTIVE
            msg = '승인하였습니다.'
            await Approval.updateOne({ _id }, { $set: { status } }, { runValidators: true })
            await sendAttendConfirmationEmail(approval, status)
        } else {
            status = this.APPROVAL_STATUS.WRONG
            msg = '기간에 문제가 있습니다.'
        }
        return { status, msg }
    }

    /**
     * Rejects/Cancels a request and cleans up any related events
     */
    static async makeCancel(approval) {
        const { _id } = approval
        const status = this.APPROVAL_STATUS.CANCEL
        if (approval.status === this.APPROVAL_STATUS.ACTIVE) {
            await this.deleteEvent(approval)
        }
        await Approval.updateOne({ _id }, { $set: { status } }, { runValidators: true })
        await sendAttendConfirmationEmail(approval, status)
        return { status, msg: '취소하였습니다.' }
    }

    /**
     * Handles cancellation requested by the user themselves
     */
    static async cancelApprovalByUser(approval, reqUserEmail, isAdmin) {
        // 권한 체크
        if (approval.email !== reqUserEmail && !isAdmin) {
            return { success: false, code: 403, msg: '이 작업을 수행할 권한이 없습니다.' }
        }

        // 상태 체크
        if (approval.status !== this.APPROVAL_STATUS.PENDING && approval.status !== this.APPROVAL_STATUS.ACTIVE) {
            return { success: false, code: 400, msg: '이미 취소되거나 완료된 항목입니다.' }
        }

        // 날짜 체크
        const today = DateUtil.today()
        if (approval.start < today) {
            return { success: false, code: 400, msg: '이미 일정이 시작되어 취소할 수 없습니다.' }
        }

        // 취소 처리 (이미 Active인 경우 연차 복구 및 일정 삭제 포함)
        if (approval.status === this.APPROVAL_STATUS.ACTIVE) {
            await this.deleteEvent(approval)
            await LeaveService.refundLeave(approval)
        }

        await Approval.updateOne({ _id: approval._id }, { $set: { status: this.APPROVAL_STATUS.CANCEL } }, { runValidators: true })
        return { success: true, msg: '결재 신청이 취소되었습니다.' }
    }

    /**
     * Creates a new Event document based on an approval
     */
    static async makeEvent(title, approval) {
        const endDay = DateUtil.formatNextDay(approval.end)
        if (approval.reason !== '출근') {
            const newEvent = new Event({ 
                title, 
                start: approval.start, 
                end: endDay, 
                department: approval.department, 
                employeeId: approval.employeeId 
            })
            await newEvent.save()
        }
        await ReportService.reportUpdate('add', title, approval.start, endDay)
    }

    /**
     * Deletes an event corresponding to an approval
     */
    static async deleteEvent(approval) {
        const start = approval.start
        const endDay = DateUtil.formatNextDay(approval.end)
        const title = this.makeTitle(approval)
        await Event.deleteOne({ employeeId: approval.employeeId, start, end: endDay, title })
    }
}
