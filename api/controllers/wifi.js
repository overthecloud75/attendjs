import { logger, reqFormat } from '../config/winston.js'
import DeviceOn from '../models/DeviceOn.js'
import Device from '../models/Device.js'
import { sanitizeData } from '../utils/util.js'

const insertOwner = (deviceOns, deviceDict) => {
    for (let deviceOn of deviceOns) {
        if (Object.keys(deviceDict).includes(deviceOn['mac'])) {
            deviceOn['owner'] = deviceDict[deviceOn['mac']]
        }
    }
    return deviceOns 
}

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const ip = req.query.ip
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')

        const devices = await Device.find({owner: {$ne:null}}).lean()
        let deviceDict = {}
        for (const device of devices) {
            deviceDict[device['mac']] = device['owner']
        }

        let deviceOns
        if (ip && ip !== '') {
            deviceOns = await DeviceOn.find({ip, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        } else { 
            deviceOns = await DeviceOn.find({ip: {$regex: process.env.WIFI_RANGE}, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        }
        if (startDate === endDate) {
            deviceOns = insertOwner(deviceOns, deviceDict)
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(deviceOns)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}
