import { logger, reqFormat } from '../config/winston.js'
import { WORKING } from '../config/working.js'
import Event from '../models/Event.js'
import Employee from '../models/Employee.js'
import { reportUpdate } from './eventReport.js'
import { sanitizeData } from '../utils/util.js'

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
        const approver = await getApprover(req)
        res.status(200).send('Event has been created.')
    } catch (err) {
        next(err)
    }
}

const getApprover = async (req) => {
    const employee = await Employee.findOne({email: req.user.email})
    let baseApprover = {name: '', department: ''}
    let approver = baseApprover
    if (employee.position === '팀원') {
        approver = await Employee.findOne({position: '팀장', department: employee.department})
        if (!approver) {
            approver = await Employee.findOne({position: '본부장'})
        }
    } else if (employee.position === '팀장') {
        approver = await Employee.findOne({position: '대표이사'})
    } 
    baseApprover = {name: approver.name, department: approver.department}
    return baseApprover
}



