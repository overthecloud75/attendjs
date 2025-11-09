import Meeting from '../models/Meeting.js'
import { sanitizeData } from '../utils/util.js'

export const getMeetings = async (req, res, next) => {
    try {
        const { room } = req.query
        const start = sanitizeData(req.query.start, 'date')
        const end = sanitizeData(req.query.end, 'date')
        const events = await fetchEvents(start, end, room)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(events)
    } catch (err) {
        next(err)
    }
}

const fetchEvents = async (start, end, room) => {
    const baseQuery = { start: {$gte: start, $lt: end}, room }
    const events = await Meeting.find({ ...baseQuery}).sort({ start: 1 })
    return events
}

export const addMeeting = async (req, res, next) => {
    try {
        const { title, date: rawDate, start: rawStart, end: rawEnd, name, meetingType, room } = req.body
        const date = sanitizeData(rawDate, 'date')
        const start = `${date}T${rawStart}:00`
        const end =  `${date}T${rawEnd}:00`

        const meetingRoom = await Meeting.find({start: {$gte: start, $lt: end}, room})
        if (meetingRoom.length === 0) {
            const newMeeting = new Meeting({ title, start, end, name, meetingType, room })
            await newMeeting.save()
            res.status(200).json(newMeeting)
        } else {
            res.status(409).send('A duplicated reservatation exists.')
        }
    } catch (err) {
        next(err)
    }
}

export const deleteMeeting = async (req, res, next) => {
    try {
        const { _id } = req.body

        const result = await Meeting.deleteOne({ _id })
        if (result.deletedCount === 0) {
            throw createError(400, "The event isn't deleted")
        }
        res.status(200).send('Event has been deleted.')
    } catch (err) {
        next(err)
    }
}