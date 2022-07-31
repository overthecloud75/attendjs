import axios from "axios";
import { format } from "date-fns"

export const getEvents = async (args)=> {
    const params = {start: format(args.start, "yyyy-MM-dd"), end: format(args.end, "yyyy-MM-dd")}
    try { const res = await axios.get('/event', {params});
        return res.data
    } catch (err) {
        console.log('err', err)
    }
};

export const addEvent = async (args)=> {
    console.log('addArgs', args)
    const data = {title: args.title, id: args.id, start: args.start, end: args.end}
    try { const res = await axios.post('/event/add', data);
        return res.data
    } catch (err) {
        console.log('err', err)
    }
};

export const deleteEvent = async (args)=> {
    console.log('deleteArgs', args);
    const data = {id: Number(args.id)}
    try { const res = await axios.delete('/event/delete', {data})
        console.log('res', res)
        return res.data
    } catch (err) {
        console.log('err', err)
    }
};
