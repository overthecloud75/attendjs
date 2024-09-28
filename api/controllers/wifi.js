import DeviceOn from '../models/DeviceOn.js'
import Device from '../models/Device.js'
import { sanitizeData } from '../utils/util.js'

const insertOwner = (deviceOns, deviceDict) => {
    return deviceOns.map(deviceOn => ({
        ...deviceOn,
        owner: deviceDict[deviceOn.mac] || null
    }))
}

export const search = async (req,res,next) => {
    try {
        const { ip } = req.query
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')

        const devices = await Device.find({owner: {$ne:null}})
        let deviceDict = {}
        for (const device of devices) {
            deviceDict[device['mac']] = device['owner']
        }

        let deviceOns
        if (ip) {
            deviceOns = await DeviceOn.find({ip, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        } else { 
            deviceOns = await DeviceOn.find({ip: {$regex: process.env.WIFI_RANGE}, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        }
        if (startDate === endDate) {
            deviceOns = insertOwner(deviceOns, deviceDict)
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(deviceOns)
    } catch (err) {
        next(err)
    }
}
