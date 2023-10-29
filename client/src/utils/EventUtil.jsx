import axios from 'axios'
import { format } from 'date-fns'
import { WORKING } from '../configs/working'

export const getColor = (event) => {
    let title = event.title.split('/')
    if (title.length === 1) {
        title = title[0].split(' ')
    }
    if (title.length > 1) {
        let event_title = title[1]
        for (const s of Object.keys(WORKING.status)) { 
            if (title[1].includes(s)) {
                event_title = s
            }
        }
        if (Object.keys(WORKING.offDay).includes(event_title)){
            event.color = 'yellow'
            event.textColor = 'black'
        }
        else if (Object.keys(WORKING.status).includes(event_title)){ }
        else { event.color = 'green' }
    }
    else {
        event.color = 'red'
    }
    return event 
}

export const getEventsInCalendar = async (args, option) => {
    const params = {start: format(args.start, 'yyyy-MM-dd'), end: format(args.end, 'yyyy-MM-dd'), option}
    try { const res = await axios.get('/api/event', {params, headers: {'Cache-Control': 'no-cache'}})
        for (let event of res.data) {
            getColor(event)
        }
        const data = res.data 
        const err = false
        axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
        axios.defaults.headers.delete['X-CSRF-Token'] = res.headers.csrftoken
        return {data, err}
    } catch (err) {
        const data = []
        return {data, err}
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

