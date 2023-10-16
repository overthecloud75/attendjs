import { logger, reqFormat } from '../config/winston.js'
import Location from '../models/Location.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const location = req.query.name
        let locations
        if (location) {
            locations = await Location.find({location}).sort({location: 1})
        } else { 
            locations = await Location.find().sort({location: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(locations)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const update = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const _id = req.body._id 
        const location = req.body.location
        const latitude = req.body.latitude
        const longitude = req.body.longitude
        const dev = req.body.dev
        const locations = await Location.updateOne({_id}, {$set: {location, latitude, longitude, dev}})
        res.status(200).json(locations)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}