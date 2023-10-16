import { logger, reqFormat } from '../config/winston.js'
import Device from '../models/Device.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const mac = req.query.mac
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
        console.log('err', err)
        next(err)
    }
}

export const update = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const _id = req.body._id
        const info = req.body.info
        const type = req.body.type
        const location = req.body.location
        const charge = req.body.charge
        const owner = req.body.owner
        const device = await Device.updateOne({_id}, {$set: {info, type, location, charge, owner}})
        res.status(200).json(device)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}
