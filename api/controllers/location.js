import Location from '../models/Location.js'

export const search = async (req, res, next) => {
    try {
        const { name: location } = req.query
        let locations
        if (location) {
            locations = await Location.find({location}).sort({location: 1})
        } else { 
            locations = await Location.find().sort({location: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(locations)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const { _id, location, latitude, longitude, dev }= req.body
        await Location.updateOne({_id}, {$set: {location, latitude, longitude, dev}}, {runValidators: true})
        res.status(200).json({message:'updated'})
    } catch (err) {
        next(err)
    }
}

export const write = async (req, res, next) => {
    try {
        const { location, latitude, longitude, dev } = req.body
        const newLocation = Location({location, latitude, longitude, dev})
        await newLocation.save()
        res.status(200).json(newLocation)
    } catch (err) {
        next(err)
    }
}

export const deleteLocation = async (req, res, next) => {
    try {
        const { _id } = req.body
        const location = await Location.deleteOne({_id})
        res.status(200).json(location)
    } catch (err) {
        next(err)
    }
}