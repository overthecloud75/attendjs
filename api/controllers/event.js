import Event from '../models/Event.js'
import Employee from '../models/Employee.js'
import Approval from '../models/Approval.js'
import Report from '../models/Report.js'
import { isValidObjectId } from '../models/utils.js'
import { getEmployeeByEmail } from './employee.js'
import { reportUpdate } from './eventReport.js'
import { sanitizeData, getNextDay, getToday } from '../utils/util.js'
import { sendAttendRequestEmail, sendAttendConfirmationEmail } from '../utils/email.js'
import { getLeftLeaveSummary } from './summary.js'
import { createError } from '../utils/error.js'
import { renderSimpleMessage } from '../utils/htmlTemplate.js'
import { WORKING } from '../config/working.js'

const APPROVAL_STATUS = {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    CANCEL: 'Cancel',
    WRONG: 'Wrong'
}

const getReasons = () => Object.keys(WORKING.reason) 

export const getEventsInCalendar = async (req, res, next) => {
    try {
        const { option } = req.query
        const start = sanitizeData(req.query.start, 'date')
        const end = sanitizeData(req.query.end, 'date')    
        const events = await fetchEvents(start, end, option, req.user)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(events)
    } catch (err) {
        next(err)
    }
}

const fetchEvents = async (start, end, option, user) => {
    const baseQuery = { start: { $gte: start, $lt: end }, employeeId: { $exists: true } }
    let events = []
    let attendStatus = []
    const notExistEmployeeIdEvent = await Event.find({ ...baseQuery, employeeId: { $exists: false } }).sort({ start: 1 })

    switch (option) {
        case 'private':
            const employeeId = user.employeeId
            events = await Event.find({ ...baseQuery, employeeId }).sort({ start: 1 })
            attendStatus = await getEventFromStatus(start, employeeId)
            break
        case 'company':
            events = await Event.find(baseQuery).sort({ start: 1 })
            break
        case 'team':
            events = await Event.find({ ...baseQuery, department: user.department }).sort({ start: 1 })
            break
    }
    events = [...events, ...notExistEmployeeIdEvent, ...attendStatus]
    return events
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

        if (!event || !WORKING.specialHolidays.includes(event.title)) {
            throw createError(400, "The event can't be deleted")
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
    /* 
        1. apporover 확인 
        2. 연차 기록 확인 
    */
    try {
        const employee = await getEmployeeByEmail(req.user.email)
        const approverWithEmployeeId = await getApprover(employee)
        const {employeeId, ...approver} = approverWithEmployeeId
        const summary = await getLeftLeaveSummary(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({approver, summary})
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
        const employee = await getEmployeeByEmail(email)
        const approver = await getApprover(employee)
        const reasons = getReasons()
        if (!reasons.includes(reason)) {
            throw createError(400, 'Something Wrong!')
        }
        const checkTheSameApproval = await Approval.findOne({email, start, end, reason})
        if (checkTheSameApproval && checkTheSameApproval.status !== APPROVAL_STATUS.CANCEL) {
            res.status(200).send('An approval with the same details already exists.')
        } else {
            const newApproval = new Approval({approvalType: 'attend', employeeId: employee.employeeId, name: employee.name, email, department: employee.department, start, end, reason, etc, approverName: approver.name, approverEmail: approver.email})
            await newApproval.save()
            const summary = await getLeftLeaveSummary(employee)
            await sendAttendRequestEmail(newApproval, summary)
            res.status(200).send('Event has been created.')
        }
    } catch (err) {
        next(err)
    }
}

const getEtcValue = (reason, rawEtc) => {
    let etc = rawEtc
    if (reason === '반차' && rawEtc === '오후반차') {} 
    else if (reason === '반차') {
        etc = '오전반차'
    } else if (reason === '기타') {}
    else {etc = ''}
    return etc
}


export const getApprover = async (employee) => {
    let approver
    switch (employee.position) {
        case '팀원':
            approver = await Employee.findOne({position: '팀장', department: employee.department, regular: { $ne: '퇴사' }})
            if (!approver) { approver = await Employee.findOne({position: '본부장', regular: { $ne: '퇴사' }})}
            break 
        case '팀장':
            approver = await Employee.findOne({position: '본부장', regular: { $ne: '퇴사' }})
            break
        case '본부장':
            approver = employee
            break
        case '대표이사':
            approver = employee
            break
        default:
            approver = await Employee.findOne({position: '본부장', regular: { $ne: '퇴사' }})
    }
    const baseApprover = {name: approver.name, position:approver.position, department: approver.department, email: approver.email, employeeId: approver.employeeId}
    return baseApprover
}

export const getConsenter = async (employee) => {
    let consenter = await Employee.findOne({position: '팀장', department: '관리팀', regular: { $ne: '퇴사' }})
    if (!consenter) {
        consenter = await Employee.findOne({position: '대표이사', regular: { $ne: '퇴사' }})
    }
    return consenter
}

// ✅ 결재 승인 함수
export const confirmApproval = async (req, res, next) => {
    await handleApprovalAction(req, res, next, makeActive, '결재 승인 완료')
}

// ✅ 결재 반려 함수
export const confirmCancel = async (req, res, next) => {
    await handleApprovalAction(req, res, next, makeCancel, '결재 반려 완료')
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

export const makeActive = async (approval) => {
    const { _id, start, end } = approval
    console.log(approval)
    let status 
    let msg 
    if (end >= start) {
        const title = makeTitle(approval)
        await makeEvent(title, approval)
        status = APPROVAL_STATUS.ACTIVE
        msg = '승인하였습니다.'
        await Approval.updateOne({_id}, {$set: {status}}, {runValidators: true})
        await sendAttendConfirmationEmail(approval, status)
    } else {
        status = APPROVAL_STATUS.WRONG
        msg = '기간에 문제가 있습니다.'
    }
    return {status, msg}
}

export const makeCancel = async (approval) => {
    const { _id } = approval
    const status = APPROVAL_STATUS.CANCEL
    if (approval.status === APPROVAL_STATUS.ACTIVE) {
        await deleteEvent(approval)
    }
    await Approval.updateOne({_id}, {$set: {status}}, {runValidators: true})
    await sendAttendConfirmationEmail(approval, status)
    const msg = '취소하였습니다.'
    return {status, msg}
}

const makeTitle = (approval) => {
    const title = (approval.etc) ? (`${approval.name}/${approval.etc}`) : (`${approval.name}/${approval.reason}`)
    return title
}

const makeEvent = async (title, approval) => {
    // reason이 출근인 경우 calendar에 기록 안 함 
    const end = getNextDay(approval.end)
    if (approval.reason !== '출근') {
        const newEvent = new Event({title, start: approval.start, end, department: approval.department, employeeId: approval.employeeId})
        await newEvent.save()
    }
    await reportUpdate('add', title, approval.start, end)
}

const deleteEvent = async (approval) => {
    const start = approval.start 
    const end = getNextDay(approval.end)
    const title = makeTitle(approval)
    await Event.deleteOne({employeeId: approval.employeeId, start, end, title})
}

const getEventFromStatus = async (start, employeeId) => {
    const today = getToday()
    let attendStatus = []
    if (start <= today) {
        const attends = await Report.find({date: {$gte: start, $lte: today}, employeeId, status: { $in: ['미출근', '지각'] }}).sort({ date: 1})
        for (const attend of attends) {
            attendStatus.push({title: attend['status'], start: attend['date'], end: getNextDay(attend['date'])})
        }
    }
    return attendStatus
}


