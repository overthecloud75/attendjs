import axios from 'axios'
import { format } from 'date-fns'
import { WORKING } from '../configs/working'

const makeApiRequest = async (method, endpoint, payload = null) => {
    try {
        const config = {
            method,
            url: `/api/${endpoint}`,
            ...(method === 'GET' && payload && { params: payload }),
            ...(method === 'POST' && payload && { data: payload })
        }
        
        const response = await axios(config)
        
        if (response.headers.csrftoken) {
            axios.defaults.headers.post['X-CSRF-Token'] = response.headers.csrftoken
        }
        return { data: response.data, error: false }
    } catch (error) {
        return { data: [], error }
    }
  }

export const getColor = (event) => {
    let title = event.title.split('/')
    if (title.length > 1) {
        let eventTitle = title[1]
        if (eventTitle in WORKING.offDay){
            event.color = 'yellow'
            event.textColor = 'black'
        } else if (eventTitle in WORKING.reason) { 
            event.textColor = 'white'
        } else { event.color = '#388e3c' }
    } else {
        event.color = 'red'
    }
    return event 
}

export const getPrivateColor = (event) => {
    let title = event.title.split('/')
    if (title.length > 1) {
        let eventTitle = title[1]
        event.title = eventTitle 
        if (eventTitle in WORKING.offDay){
            event.color = 'yellow'
            event.textColor = 'black'
        } else if (eventTitle in WORKING.reason) { 
            event.textColor = 'white'
        } else { event.color = '#388e3c' }
    } else {
        if (['미출근', '지각'].includes(event.title)) {
            event.color = 'orange'
            event.textColor = 'black'
        } else {
            event.color = 'red'
        }
    }
    return event 
}

export const getRoomEvents = (event) => {
    let meetingType = event.meetingType
    if (meetingType === '내부'){
        event.color = '#1976d2'
        event.textColor = 'white'
    } else {
        event.color = '#388e3c'
        event.textColor = 'white'
    }
    return event 
}

export const getSpecialHolidays = () => {
    return WORKING.specialHolidays.join(' / ') 
}

export const getEventsInCalendar = async (args, option) => {
    const params = {
        start: format(args.start, 'yyyy-MM-dd'), 
        end: format(args.end, 'yyyy-MM-dd'), 
        option
    }
    const { data, error } = await makeApiRequest('GET', 'event', params)
    if (!error) {
        if (option === 'private') {
            data.forEach(getPrivateColor)
        } else {
            data.forEach(getColor)
        }
    }
    return {data, error}
}

export const addEventInCalendar = async (data) => {
    if (data && WORKING.specialHolidays.includes(data.title)) {  
        return makeApiRequest('POST', 'event/add', data)
    } 
    return {data: [], error: "It's an event that can't be created."}
}

export const deleteEventInCalendar = async (args) => {
    return makeApiRequest('POST', 'event/delete', { _id: args.extendedProps._id })
}

export const getApproval = async () => {
    return makeApiRequest('GET', 'event/approval')
}

export const getLeftLeave = async () => {
    return makeApiRequest('GET', 'summary/leftLeave') 
}

export const postApproval = async (data) => {
    return makeApiRequest('POST', 'event/approval', data)
}

export const getPaymentApproval = async () => {
    return makeApiRequest('GET', 'payment')
}

export const postPaymentApproval = async (data) => {
    return makeApiRequest('POST', 'payment', data)
}

export const getMeetingsInCalendar = async (args, room) => {

    const previousStart = new Date(args.start)
    previousStart.setDate(args.start.getDate() - 1)

    const params = {
        start: format(previousStart, 'yyyy-MM-dd'), 
        end: format(args.end, 'yyyy-MM-dd'), 
        room
    }
    const { data, error } = await makeApiRequest('GET', 'meeting', params)
    if (!error) {
        data.forEach(getRoomEvents)
    }
    return {data, error}
}

export const postMeetingReservation = async (data) => {
    return makeApiRequest('POST', 'meeting/add', data)
}

export const deleteMeetingInCalendar = async (args) => {
    return makeApiRequest('POST', 'meeting/delete', { _id: args.extendedProps._id })
}

export const getCreditCardNo = async () => {
    return makeApiRequest('GET', 'creditcard/cardNo')
}

export const getApiKey = async () => {
    return makeApiRequest('GET', 'auth/apiKey')
}

export const updateApiKey = async () => {
    return makeApiRequest('POST', 'auth/apiKey')
}
