import Event from '../models/Event.js'
import Employee from '../models/Employee.js'
import Approval from '../models/Approval.js'
import { isValidObjectId } from '../models/utils.js'
import { getEmployeeByEmail } from './employee.js'
import { reportUpdate } from './eventReport.js'
import { sanitizeData } from '../utils/util.js'
import { attendRequestEmail, attendConfirmationEmail } from '../utils/email.js'
import { getLeftLeaveSummary } from './summary.js'
import { createError } from '../utils/error.js'
import { WORKING } from '../config/working.js'

const APPROVAL_STATUS = {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    CANCEL: 'Cancel',
    WRONG: 'Wrong'
}

const getReasons = () => Object.keys(WORKING.status) 

export const makeHtml = (event) => `<h1 style="text-align:center;">${event}</h1>`

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
    const baseQuery = { start: { $gte: start, $lt: end } }
    let events = []

    switch (option) {
        case 'private':
            events = await Event.find({ ...baseQuery, employeeId: user.employeeId }).sort({ start: 1 })
            break
        case 'company':
            events = await Event.find(baseQuery).sort({ start: 1 })
            break
        case 'team':
            events = await Event.find({ ...baseQuery, department: user.department }).sort({ start: 1 })
            const notExistEmployeeIdEvent = await Event.find({ ...baseQuery, employeeId: { $exists: false } }).sort({ start: 1 })
            events = [...events, ...notExistEmployeeIdEvent]
            break
    }
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
        const { reason, etc } = req.body
        const start = sanitizeData(req.body.start, 'date')
        const end = sanitizeData(req.body.end, 'date')
        const email = req.user.email
        const employee = await getEmployeeByEmail(email)
        const approver = await getApprover(employee)
        const reasons = getReasons()
        if (!reasons.includes(reason)) {
            throw createError(400, 'Something Wrong!')
        }
        const checkTheSameApproval = await Approval.findOne({email, start, end, reason, etc})
        if (checkTheSameApproval && checkTheSameApproval.status !== APPROVAL_STATUS.CANCEL) {
            res.status(200).send('Already there is the same approval.')
        } else {
            const newApproval = new Approval({approvalType: 'attend', employeeId: employee.employeeId, name: employee.name, email: employee.email, department: employee.department, start, end, reason, etc, approverName: approver.name, approverEmail: approver.email})
            await newApproval.save()
            const summary = await getLeftLeaveSummary(employee)
            await attendRequestEmail(newApproval, summary)
            res.status(200).send('Event has been created.')
        }
    } catch (err) {
        next(err)
    }
}

export const getApprover = async (employee) => {
    let approver
    switch (employee.position) {
        case '팀원':
            approver = await Employee.findOne({position: '팀장', department: employee.department})
            if (!approver) { approver = await Employee.findOne({position: '본부장'})}
            break 
        case '팀장':
            approver = await Employee.findOne({position: '본부장'})
            break
        case '본부장':
            approver = employee
            break
        case '대표이사':
            approver = employee
            break
        default:
            approver = await Employee.findOne({position: '본부장'})
    }
    const baseApprover = {name: approver.name, department: approver.department, email: approver.email, employeeId: approver.employeeId}
    return baseApprover
}

export const getConsenter = async (employee) => {
    const consenter = await Employee.findOne({position: '팀장', department: '관리팀'})
    return consenter
}

export const confirmApproval = async (req, res, next) => {
    /* 
        1. _id 확인
        2. status가 pending이면서 기간에 문제가 없으면 status를 Active로 바꾸고 달력에 저장하고 confirm email 송부 
    */
    try {
        const { _id }  = req.params
        if (isValidObjectId(_id)) {
            const approval = await Approval.findOne({_id})
            if (!approval) throw createError(403, 'approval not found!')
            if (approval.status === APPROVAL_STATUS.PENDING){
                const result = await makeActive(approval)
                res.status(200).send(makeHtml(result.msg))
            } else {
                res.status(200).send(makeHtml('이미 처리하였습니다.'))
            }
        } else {
            throw createError(404, 'approval not found!')
        }
    } catch (err) {
        next(err)
    }
}

export const confirmCancel = async (req, res, next) => {
    try {
        const { _id }  = req.params
        if (isValidObjectId(_id)) {
            const approval = await Approval.findOne({_id})
            if (!approval) return next(createError(404, 'approval not found!'))
            if (approval.status === APPROVAL_STATUS.PENDING){
                const result = await makeCancel(approval)
                res.status(200).send(makeHtml(result.msg))
            } else {
                res.status(200).send(makeHtml('이미 처리하였습니다.'))
            }
        } else {
            throw createError(404, 'approval not found!')
        }
    } catch (err) {
        next(err)
    }
}

export const makeActive = async (approval) => {
    const { _id, start, end } = approval
    let status 
    let msg 
    if (end >= start) {
        const title = makeTitle(approval)
        await makeEvent(title, approval)
        status = APPROVAL_STATUS.ACTIVE
        msg = '승인하였습니다.'
        await Approval.updateOne({_id}, {$set: {status}}, {runValidators: true})
        await attendConfirmationEmail(approval, status)
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
    await attendConfirmationEmail(approval, status)
    const msg = '취소하였습니다.'
    return {status, msg}
}

const makeTitle = (approval) => {
    const title = (approval.reason === '기타' && approval.reason !== '') ? (approval.name + '/' + approval.etc) : (approval.name + '/' + approval.reason)
    return title
}

const makeEvent = async (title, approval) => {
    // reason이 출근인 경우 calendar에 기록 안 함 
    const end = getNextDate(approval.end)
    if (approval.reason !== '출근') {
        const newEvent = new Event({title, start: approval.start, end, department: approval.department, employeeId: approval.employeeId})
        await newEvent.save()
    }
    await reportUpdate('add', title, approval.start, end)
}

const deleteEvent = async (approval) => {
    const start = approval.start 
    const end = getNextDate(approval.end)
    const title = makeTitle(approval)
    await Event.deleteOne({employeeId: approval.employeeId, start, end, title})
}

export const getNextDate = (date) => {
    const dateSplit = date.split('-')
    let year = Number(dateSplit[0])
    let month = Number(dateSplit[1])
    let day = Number(dateSplit[2])
    const newDate = new Date(year, month - 1, day)
    const nextDate = new Date(newDate.getTime() + (24 * 60 * 60 * 1000))

    year = nextDate.getFullYear();
    month = String(nextDate.getMonth() + 1).padStart(2, '0');
    day = String(nextDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}




