import { logger, reqFormat } from '../config/winston.js'
import Device from '../models/Device.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const mac = req.query.mac
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let devices
        if (mac && mac !== '') {
            devices = await Device.find({mac, endDate: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        }
        else { 
            devices = await Device.find({endDate: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1, mac: 1});
        }
        res.status(200).json(devices)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const update = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const _id = req.body._id
        const info = req.body.info
        const location = req.body.location
        const owner = req.body.owner
        const device = await Device.updateOne({_id}, {$set: {info, location, owner}})
        res.status(200).json(device)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}
