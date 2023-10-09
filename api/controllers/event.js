import { logger, reqFormat } from '../config/winston.js'
import { WORKING } from '../config/working.js'
import Event from '../models/Event.js'
import Employee from '../models/Employee.js'
import Approval from '../models/Approval.js'
import { getEmployeeByEmail } from './employee.js'
import { reportUpdate } from './eventReport.js'
import { sanitizeData } from '../utils/util.js'
import { attendRequestEmail, attendConfirmationEmail } from '../utils/email.js'
import { getLeftLeaveSummary } from './summary.js'

const makeHtml = (event) => {
    return `<h1 style=
                "text-align:center;"
            >
                ${event}
            </h1>`
}

export const getEventsInCalendar = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const start = sanitizeData(req.query.start, 'date')
        const end = sanitizeData(req.query.end, 'date')    
        const option = req.query.option
        let events = []
        if (option==='private') {
            events = await Event.find({start: {$gte: start, $lt: end}, employeeId: {$exists: true, $eq: req.user.employeeId}}).sort({id: 1})
        } else if (option==='company') {
            events = await Event.find({start: {$gte: start, $lt: end}}).sort({id: 1})
        } else {
            events = await Event.find({start: {$gte: start, $lt: end}, department: req.user.department}).sort({id: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(events)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const addEventInCalendar = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        const title = req.body.title
        const start = req.body.start
        const end = req.body.end
        const newEvent = new Event({id, title, start, end})
        if (WORKING.specialHolidays.includes(title)) {
            await newEvent.save()
            res.status(200).send('Event has been created.')
        } else if (title.includes('/')) {
            await newEvent.save()
            await reportUpdate('add', title, start, end)
            res.status(200).send('Event has been created.')
        } else {
            next({status: 500, message: '/ is not included'})
        }
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const deleteEventInCalendar = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        const event = await Event.findOne({id}).lean()
        const eventDelete = await Event.deleteOne({id}) 
        if (eventDelete.deletedCount) {
            await reportUpdate('delete', event.title, event.start, event.end)
            res.status(200).send('Event has been deleted.')
        } else {
            res.status(400).send('not deleted')
        }
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const getApproval = async (req, res, next) => {
    logger.info(reqFormat(req))
    /* 
        1. apporover 확인 
        2. 연차 기록 확인 
    */
    try {
        const employee = await getEmployeeByEmail(req.user.email)
        const approver = await getApprover(employee)
        const summary = await getLeftLeaveSummary(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({approver, summary})
    } catch (err) {
        next(err)
    }
}

export const postApproval = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const start = sanitizeData(req.body.start, 'date')
        const end = sanitizeData(req.body.end, 'date')
        const employee = await getEmployeeByEmail(req.user.email)
        const approver = await getApprover(employee)
        const checkTheSameApproval = await Approval.findOne({email: req.user.email, start, end, reason: req.body.reason})
        if (checkTheSameApproval && checkTheSameApproval.status === 'Pending') {
            res.status(200).send('결재가 진행중에 있습니다.')
        } else {
            const newApproval = new Approval({approvalType: 'attend', employeeId: employee.employeeId, name: employee.name, email: employee.email, department: employee.department, start, end, reason: req.body.reason, etc: req.body.etc, approverName: approver.name, approverEmail: approver.email})
            await newApproval.save()
            const summary = await getLeftLeaveSummary(employee)
            await attendRequestEmail(newApproval, summary)
            res.status(200).send('Event has been created.')
        }
    } catch (err) {
        next(err)
        console.log(err)
    }
}

const getApprover = async (employee) => {
    let baseApprover = {name: '', department: '', email: ''}
    let approver = baseApprover
    if (employee.position === '팀원') {
        approver = await Employee.findOne({position: '팀장', department: employee.department})
        if (!approver) {
            approver = await Employee.findOne({position: '본부장'})
        }
    } else if (employee.position === '팀장') {
        approver = await Employee.findOne({position: '본부장'})
    } else if (employee.position === '본부장') {
        approver = await Employee.findOne({position: '대표이사'})
    }
    baseApprover = {name: approver.name, department: approver.department, email: approver.email}
    return baseApprover
}

export const confirmApproval = async (req, res, next) => {
    logger.info(reqFormat(req))
    /* 
        1. _id 확인
        2. status가 pending이면서 기간에 문제가 없으면 status를 Active로 바꾸고 달력에 저장하고 confirm email 송부 
    */
    try {
        const _id = req.params._id
        const approval = await Approval.findOne({_id})
        if (!approval) return next(createError(404, 'approval not found!'))
        if (approval.status === 'Pending'){
            const result = await makeActive(approval)
            res.status(200).send(makeHtml(result.msg))
        } else {
            res.status(200).send(makeHtml('이미 처리하였습니다.'))
        }
    } catch (err) {
        next(err)
    }
}

export const confirmCancel = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const _id = req.params._id
        const approval = await Approval.findOne({_id})
        if (!approval) return next(createError(404, 'approval not found!'))
        if (approval.status === 'Pending'){
            const result = await makeCancel(approval)
            res.status(200).send(makeHtml(result.msg))
        } else {
            res.status(200).send(makeHtml('이미 처리하였습니다.'))
        }
    } catch (err) {
        next(err)
    }
}

export const makeActive = async (approval) => {
    let status 
    let msg 
    if (approval.end >= approval.start) {
        const title = makeTitle(approval)
        await makeEvent(title, approval)
        status = 'Active'
        msg = '승인하였습니다.'
        await Approval.updateOne({_id: approval._id}, {$set: {status}})
        await attendConfirmationEmail(approval, status)
    } else {
        status = 'Wrong'
        msg = '기간에 문제가 있습니다.'
    }
    return {status, msg}
}

export const makeCancel = async (approval) => {
    const status = 'Cancel'
    if (approval.status === 'Active') {
        await deleteEvent(approval)
    }
    await Approval.updateOne({_id: approval._id}, {$set: {status}})
    await attendConfirmationEmail(approval, status)
    const msg = '취소하였습니다.'
    return {status, msg}
}

const makeTitle = (approval) => {
    let title = approval.name + '/' + approval.reason
    if (approval.reason === '기타' && approval.reason !== '') {
        title = approval.name + '/' + approval.etc  
    }
    return title
}

const makeEvent = async (title, approval) => {
    // reason이 출근인 경우 calendar에 기록 안 함 
    const end = getNextDate(approval.end)
    if (approval.reason !== '출근') {
        const newEvent = new Event({id: Date.now(), title, start: approval.start, end, department: approval.department, employeeId: approval.employeeId})
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




