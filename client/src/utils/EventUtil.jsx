import axios from 'axios'
import { format } from 'date-fns'
import { WORKING } from '../configs/working'

export const getColor = (event) => {
    var title = event.title.split('/')
    if (title.length === 1) {
        title = title[0].split(' ')
    }
    if (title.length > 1) {
        var event_title = title[1]
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

export const getEvents = async (args)=> {
    const params = {start: format(args.start, "yyyy-MM-dd"), end: format(args.end, "yyyy-MM-dd")}
    try { const res = await axios.get('/event', {params, headers: {'Cache-Control': 'no-cache'}})
        for (let event of res.data) {
            event = getColor(event)
        }
        return res.data
    } catch (err) {
        console.log('err', err)
    }
};

export const addEvent = async (args)=> {
    console.log('addArgs', args)
    const data = {title: args.title, id: args.id, start: args.start, end: args.end}
    try { const res = await axios.post('/event/add', data)
        return res.data
    } catch (err) {
        console.log('err', err)
    }
};

export const deleteEvent = async (args)=> {
    const data = {id: Number(args.id)}
    try { const res = await axios.delete('/event/delete', {data})
        console.log('res', res)
        return res.data
    } catch (err) {
        console.log('err', err)
    }
};
