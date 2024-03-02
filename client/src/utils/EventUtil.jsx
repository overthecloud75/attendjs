import axios from 'axios'
import { format } from 'date-fns'
import { WORKING } from '../configs/working'

export const getColor = (event) => {
    let title = event.title.split('/')
    if (title.length === 1) {
        title = title[0].split(' ')
    }
    if (title.length > 1) {
        let eventTitle = title[1]
        for (const s in WORKING.status) { 
            if (title[1].includes(s)) {
                eventTitle = s
            }
        }
        if (eventTitle in WORKING.offDay){
            event.color = 'yellow'
            event.textColor = 'black'
        } else if (eventTitle in WORKING.status) { 
            event.textColor = 'white'
        } else { event.color = 'green' }
    }
    else {
        event.color = 'red'
    }
    return event 
}

export const getSpecialHolidays = () => {
    let specialHolidays = ''
    for (const holiday of WORKING.specialHolidays) {
        if (specialHolidays) {
            specialHolidays = specialHolidays + ' / ' + holiday
        } else {
            specialHolidays = holiday
        } 
    }
    return specialHolidays 
}

export const getEventsInCalendar = async (args, option) => {
    const params = {start: format(args.start, 'yyyy-MM-dd'), end: format(args.end, 'yyyy-MM-dd'), option}
    try { const res = await axios.get('/api/event', {params})
        for (let event of res.data) {
            getColor(event)
        }
        const data = res.data 
        const err = false
        axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
        axios.defaults.headers.delete['X-CSRF-Token'] = res.headers.csrftoken
        return {data, err}
    } catch (err) {
        return {data: [], err}
    }
}

export const addEventInCalendar = async (data) => {
    if (data && WORKING.specialHolidays.includes(data.title)) {  // full proof 
        try { const res = await axios.post('/api/event/add', data)
            const resData = res.data
            const err = false
            return {resData, err}
        } catch (err) {
            return {resData: [], err}
        }
    } else {
        return {resData: [], err: "It's an event that cannot be created."}
    }
}

export const deleteEventInCalendar = async (args) => {
    const data = {_id: args.extendedProps._id}
    try { const res = await axios.post('/api/event/delete', data)
        const resData = res.data
        const err = false
        return {resData, err}
    } catch (err) {
        const resData = []
        return {resData, err}
    }
}

export const getApproval = async () => {
    try { const res = await axios.get('/api/event/approval')
        const resData = res.data
        const err = false
        axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
        return {resData, err}
    } catch (err) {
        const resData = []
        return {resData, err}
    }
}

export const postApproval = async (data) => {
    try { const res = await axios.post('/api/event/approval', data)
        const resData = res.data
        const err = false
        return {resData, err}
    } catch (err) {
        const resData = []
        return {resData, err}
    }
}

export const getWindowDimension = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height
    }
}

