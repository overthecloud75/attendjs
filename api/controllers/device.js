import Device from '../models/Device.js'

export const search = async (req,res,next) => {
    try {
        console.log('deviceSearch')
        const mac = req.query.mac
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let devices
        // [문제] endDate: 이름 검색시에만 실행
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
    try {
        console.log('update', req.body)
        const _id = req.body._id
        const info = req.body.info
        const owner = req.body.owner
        const device = await Device.updateOne({_id}, {$set: {info, owner}})
        res.status(200).json(device)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}
