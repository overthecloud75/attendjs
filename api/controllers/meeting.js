import Meeting from '../models/Meeting.js'
import { sanitizeData } from '../utils/util.js'
import GraphService from '../services/GraphService.js'

// 회의실명과 Microsoft 365 사서함 이메일 매핑
const ROOM_EMAIL_MAP = {
    '대회의실': 'room0@mirageworks.co.kr',
    'A 회의실': 'room1@mirageworks.co.kr',
    'B 회의실': 'room2@mirageworks.co.kr' // 필요에 따라 추가
}

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
    
    // 1. DB 로컬 데이터 조회
    const localEvents = await Meeting.find({ ...baseQuery}).sort({ start: 1 })
    
    // 2. Microsoft Graph 데이터 조회 (해당 회의실에 매핑된 이메일이 있는 경우)
    let graphEvents = []
    const roomEmail = ROOM_EMAIL_MAP[room]
    if (roomEmail) {
        const rawGraphEvents = await GraphService.getUserCalendarView(roomEmail, start, end)
        graphEvents = rawGraphEvents.map(event => ({
            _id: `graph_${event.id}`,
            title: event.subject,
            start: event.start,
            end: event.end,
            name: event.organizer || '외부 예약',
            meetingType: 'MS 365', // 구분값
            room: room,
            source: 'graph', // 추가 필드
            color: '#8b5cf6', // MS Outlook 스타일의 보라색 계열
            editable: false // 외부 데이터는 삭제 불가하게 설정
        }))
    }

    // 3. 데이터 병합
    return [...localEvents, ...graphEvents]
}

export const addMeeting = async (req, res, next) => {
    try {
        const { title, date: rawDate, start: rawStart, end: rawEnd, meetingType, room } = req.body
        const date = sanitizeData(rawDate, 'date')
        const start = `${date}T${rawStart}:00`
        const end =  `${date}T${rawEnd}:00`
        const name = `${req.user.name}/${req.user.department}`

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