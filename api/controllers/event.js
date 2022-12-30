import { logger, reqFormat } from '../config/winston.js'
import Event from '../models/Event.js'
import { reportUpdate } from './eventReport.js'
import { sanitizeData } from '../utils/util.js'

export const getEvents = async (req,res,next)=>{
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

export const addEvent = async (req,res,next)=>{
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        const title = req.body.title
        const start = req.body.start
        const end = req.body.end
        const newEvent = new Event({id, title, start, end})
        if (title.includes('/')) {
            await newEvent.save({id, title, start, end})
            await reportUpdate('add', title, start, end)
            res.status(200).send('Event has been created.')
        } else {
            next({status: 500, message: '/ is not included'})
        }
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const deleteEvent = async (req,res,next)=>{
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        console.log(id)
        const event = await Event.findOne({id}).lean()
        console.log(event)
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


