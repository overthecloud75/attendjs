import DeviceOn from '../models/DeviceOn.js'
import Device from '../models/Device.js'

export const searchWifi = async (req,res,next) => {
    try {
        const ip = req.query.ip
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let deviceOns
        // [문제] endDate: 이름 검색시에만 실행
        if (ip && ip !== '') {
            deviceOns = await Device.find({ip, date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1})
        }
        else { 
            deviceOns = await DeviceOn.find({date: {$gte: startDate, $lte: endDate}}).sort({ipStr: 1});
        }; 
        console.log('deviceOns', deviceOns)
        res.status(200).json(deviceOns);
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}
