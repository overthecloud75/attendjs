import CryptoJS from 'crypto-js'
import { logger, reqFormat } from '../config/winston.js'
import { WORKING } from '../config/working.js'
import Event from '../models/Event.js'
import Employee from '../models/Employee.js'
import Approval from '../models/Approval.js'
import { reportUpdate } from './eventReport.js'
import { sanitizeData } from '../utils/util.js'
import { attendRequestEmail, attendConfirmationEmail } from '../utils/email.js'

export const getEvents = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const start = sanitizeData(req.query.start, 'date')
        const end = sanitizeData(req.query.end, 'date')
        const events = await Event.find({start: {$gte: start, $lt: end}}).sort({id: 1})
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(events)
    } catch (err) {
        next(err)
    }
}

export const addEvent = async (req,res,next) => {
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

export const deleteEvent = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        const event = await Event.findOne({id}).lean()
        const eventDelete = await Event.deleteOne({id}) 
        if (eventDelete.deletedCount) {
            await reportUpdate('delete', event.title, event.start, event.end)
            res.status(200).send('Event has been deleted.')
        }
        else {
            res.status(400).send('not deleted')
        }
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const getApprove = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const approver = await getApprover(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(approver)
    } catch (err) {
        next(err)
    }
}

export const postApprove = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const start = sanitizeData(req.body.start, 'date')
        const end = sanitizeData(req.body.end, 'date')
        const employee = await Employee.findOne({email: req.user.email})
        const approver = await getApprover(req)
        const confirmationCode = CryptoJS.lib.WordArray.random(20).toString()
        const approval = new Approval({approvalType: 'attend', employeeId: employee.employeeId, name: employee.name, email: employee.email, department: employee.department, start, end, reason: req.body.reason, 'etc': req.body.etc, approverName: approver.name, approverEmail: approver.email, confirmationCode})
        await approval.save()
        await attendRequestEmail(employee.name, employee.department, start, end, req.body.reason, req.body.etc, approver.name, approver.email, confirmationCode)
        res.status(200).send('Event has been created.')
    } catch (err) {
        next(err)
        console.log(err)
    }
}

const getApprover = async (req) => {
    const employee = await Employee.findOne({email: req.user.email})
    let baseApprover = {name: '', department: '', email: ''}
    let approver = baseApprover
    if (employee.position === '팀원') {
        approver = await Employee.findOne({position: '팀장', department: employee.department})
        if (!approver) {
            approver = await Employee.findOne({position: '본부장'})
        }
    } else if (employee.position === '팀장') {
        approver = await Employee.findOne({position: '대표이사'})
    } 
    baseApprover = {name: approver.name, department: approver.department, email: approver.email}
    return baseApprover
}

export const confirmApprove = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const confirmationCode = req.params.confirmationCode
        const approval = await Approval.findOne({confirmationCode})
        if (!approval) return next(createError(404, 'approval not found!'))
        if (approval.status === 'Pending'){
            let title = approval.name + '/' + approval.reason
            let status
            if (approval.reason === '기타' && approval.reason !== '') {
                title = approval.name + '/' + approval.etc  
            }
            if (approval.end >= approval.start) {
                const end = getNextDate(approval.end)
                const newEvent = new Event({id: Date.now(), title, start: approval.start, end, department: approval.department})
                await newEvent.save()
                status = 'Active'
                await Approval.updateOne({confirmationCode}, {$set: {status}})
                await attendConfirmationEmail(approval.name, approval.email, approval.department, approval.start, approval.end, approval.reason, approval.etc, status)
                res.status(200).send('승인하였습니다.')
            } else {
                status = 'Wrong'
                await Approval.updateOne({confirmationCode}, {$set: {status}})
                await attendConfirmationEmail(approval.name, approval.email, approval.department, approval.start, approval.end, approval.reason, approval.etc, status)
                res.status(200).send('기간에 문제가 있습니다.')
            }
        } else {
            res.status(200).send('이미 처리 하였습니다.')
        }
    } catch (err) {
        next(err)
    }
}

export const confirmCancel = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const confirmationCode = req.params.confirmationCode
        const approval = await Approval.findOne({confirmationCode})
        if (!approval) return next(createError(404, 'approval not found!'))
        if (approval.status === 'Pending'){
            const status = 'Cancel'
            await Approval.updateOne({confirmationCode}, {$set: {status}})
            await attendConfirmationEmail(approval.name, approval.email, approval.department, approval.start, approval.end, approval.reason, approval.etc, status)
            res.status(200).send('취소하였습니다.')
        } else {
            res.status(200).send('이미 처리 하였습니다.')
        }

    } catch (err) {
        next(err)
    }
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



