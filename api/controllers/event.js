import Event from "../models/Event.js";

export const getEvents = async (req,res,next)=>{
    try {
        const start = req.query.start; 
        const end = req.query.end; 
        const events = await Event.find({start: {$gte: start, $lt: end}}).sort({id: 1});
        console.log(events); 
        res.status(200).json(events);
    } catch (err) {
        next(err);
    }
}

export const addEvent = async (req,res,next)=>{
    try {
        console.log('req', req.body); 
        const id = req.body.id; 
        const title = req.body.title; 
        const start = req.body.start; 
        const end = req.body.end; 
        const newEvent = new Event({id, title, start, end})
        await newEvent.save({id, title, start, end}); 
        res.status(200).send("Event has been created.");
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const deleteEvent = async (req,res,next)=>{
    try {
        console.log('req', req.body); 
        const id = req.body.id; 
        const event = await Event.deleteOne({id}); 
        console.log('id', id, event); 
        if (event.deletedCount) {
            res.status(200).send("Event has been deleted.");
        }
        else {
            res.status(400).send("not deleted")
        }
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}


