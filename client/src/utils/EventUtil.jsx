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
    } else {
        event.color = 'red'
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
        data.forEach(getColor)
    }
    return {data, error}
}

export const addEventInCalendar = async (data) => {
    if (data && WORKING.specialHolidays.includes(data.title)) {  
        return makeApiRequest('POST', 'event/add', data)
    } 
    return {data: [], error: "It's an event that cannot be created."}
}

export const deleteEventInCalendar = async (args) => {
    return makeApiRequest('POST', 'event/delete', { _id: args.extendedProps._id })
}

export const getApproval = async () => {
    return makeApiRequest('GET', 'event/approval')
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


