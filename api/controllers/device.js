import Device from '../models/Device.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req, res, next) => {
    try {
        const { mac } = req.query
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        let devices
        if (mac) {
            devices = await Device.find({mac, endDate: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        } else { 
            devices = await Device.find({endDate: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1, mac: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(devices)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const { _id, info, type, location, charge, owner } = req.body
        await Device.updateOne({_id}, {$set: {info, type, location, charge, owner}}, {runValidators: true})
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}
