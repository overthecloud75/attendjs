import { logger, reqFormat } from '../config/winston.js'
import DeviceOn from '../models/DeviceOn.js'
import Device from '../models/Device.js'
import { wifiRange } from '../config/process.js'

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
        const startDate = req.query.startDate
        const endDate = req.query.endDate

        const devices = await Device.find({owner: {$ne:null}}).lean()
        let deviceDict = {}
        for (const device of devices) {
            deviceDict[device['mac']] = device['owner']
        }

        let deviceOns
        if (ip && ip !== '') {
            deviceOns = await DeviceOn.find({ip, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1}).lean()
        }
        else { 
            deviceOns = await DeviceOn.find({ip: {$regex: wifiRange}, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1}).lean();
        }; 
        if (startDate === endDate) {
            deviceOns = insertOwner(deviceOns, deviceDict)
        }
        res.status(200).json(deviceOns);
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}
