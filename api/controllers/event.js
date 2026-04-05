import EventService from '../services/EventService.js'
import EmployeeService from '../services/EmployeeService.js'
import { DateUtil, sanitizeData } from '../utils/util.js'
import { sendAttendRequestEmail } from '../utils/email.js'
import LeaveService from '../services/LeaveService.js'
import { createError } from '../utils/error.js'
import { renderSimpleMessage } from '../utils/htmlTemplate.js'
import { WORKING } from '../config/working.js'
import { isValidObjectId } from '../models/utils.js'
import Approval from '../models/Approval.js'

const APPROVAL_STATUS = EventService.APPROVAL_STATUS

const getReasons = () => Object.keys(WORKING.reason)

export const getEventsInCalendar = async (req, res, next) => {
    try {
        const { option } = req.query
        const start = sanitizeData(req.query.start, 'date')
        const end = sanitizeData(req.query.end, 'date')
        const events = await EventService.fetchEvents(start, end, option, req.user)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(events)
    } catch (err) {
        next(err)
    }
}

export const addEventInCalendar = async (req, res, next) => {
    try {
        const { title, start, end } = req.body
        if (!WORKING.specialHolidays.includes(title)) {
            throw createError(400, "It's an event that can't be created.")
        }

        const newEvent = new Event({ title, start, end })
        await newEvent.save()
        res.status(200).send('Event has been created.')
    } catch (err) {
        next(err)
    }
}

export const deleteEventInCalendar = async (req, res, next) => {
    try {
        const { _id } = req.body
        const event = await Event.findOne({ _id })

        if (!event) {
            throw createError(400, "The event can't be deleted")
        }

        if (!WORKING.specialHolidays.includes(event.title)) {
            throw createError(400, "It's an event that can't be deleted.")
        }

        const result = await Event.deleteOne({ _id })
        if (result.deletedCount === 0) {
            throw createError(400, "The event isn't deleted")
        }
        res.status(200).send('Event has been deleted.')
    } catch (err) {
        next(err)
    }
}

export const getApproval = async (req, res, next) => {
    try {
        const employee = await EmployeeService.getEmployeeByEmail(req.user.email)
        const approverWithEmployeeId = await EventService.getApprover(employee)
        const { employeeId, ...approver } = approverWithEmployeeId
        const summary = await LeaveService.getLeftLeaveSummary(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({ approver, summary })
    } catch (err) {
        next(err)
    }
}

export const postApproval = async (req, res, next) => {
    try {
        const { reason, etc: rawEtc } = req.body
        const etc = getEtcValue(reason, rawEtc)

        const start = sanitizeData(req.body.start, 'date')
        const end = sanitizeData(req.body.end, 'date')
        const email = req.user.email
        const employee = await EmployeeService.getEmployeeByEmail(email)
        const approver = await EventService.getApprover(employee)
        const reasons = getReasons()
        if (!reasons.includes(reason)) {
            throw createError(400, 'Something Wrong!')
        }
        const checkTheSameApproval = await Approval.findOne({ email, start, end, reason })
        if (checkTheSameApproval && checkTheSameApproval.status !== APPROVAL_STATUS.CANCEL) {
            res.status(200).send('An approval with the same details already exists.')
        } else {
            const newApproval = new Approval({ approvalType: 'attend', employeeId: employee.employeeId, name: employee.name, email, department: employee.department, start, end, reason, etc, approverName: approver.name, approverEmail: approver.email })
            await newApproval.save()
            const summary = await LeaveService.getLeftLeaveSummary(employee)
            await sendAttendRequestEmail(newApproval, summary)
            res.status(200).send('Event has been created.')
        }
    } catch (err) {
        next(err)
    }
}

const getEtcValue = (reason, rawEtc) => {
    let etc = rawEtc
    if (reason === '반차' && rawEtc === '오후반차') { }
    else if (reason === '반차') {
        etc = '오전반차'
    } else if (reason === '기타') { }
    else { etc = '' }
    return etc
}


export const getApprover = (employee) => EventService.getApprover(employee)
export const getConsenter = (employee) => EventService.getConsenter(employee)

// ✅ 결재 승인 함수
export const confirmApproval = async (req, res, next) => {
    await handleApprovalAction(req, res, next, EventService.makeActive.bind(EventService), '결재 승인 완료')
}

export const confirmCancel = async (req, res, next) => {
    await handleApprovalAction(req, res, next, EventService.makeCancel.bind(EventService), '결재 반려 완료')
}

// ✅ 공용 결재 처리 함수
const handleApprovalAction = async (req, res, next, actionFn, successTitle) => {
    try {
        const { _id } = req.params

        if (!isValidObjectId(_id)) throw createError(400, 'Invalid ID format.')

        const approval = await Approval.findById(_id)
        if (!approval) throw createError(404, 'Approval not found.')

        if (approval.status !== APPROVAL_STATUS.PENDING)
            return res.status(200).send(renderSimpleMessage('이미 처리된 결재입니다.', '이 요청은 더 이상 유효하지 않습니다.'))

        const result = await actionFn(approval)
        return res.status(200).send(renderSimpleMessage(successTitle, result.msg))
    } catch (err) {
        next(err)
    }
}

export const makeActive = (approval) => EventService.makeActive(approval)
export const makeCancel = (approval) => EventService.makeCancel(approval)

export const cancelByUser = async (req, res, next) => {
    try {
        const { _id } = req.params
        const approval = await Approval.findById(_id)
        if (!approval) throw createError(404, 'Approval not found.')

        const result = await EventService.cancelApprovalByUser(approval, req.user.email, req.user.isAdmin)
        
        if (!result.success) {
            return res.status(result.code || 200).send(result.msg)
        }
        res.status(200).send(result.msg)
    } catch (err) {
        next(err)
    }
}
