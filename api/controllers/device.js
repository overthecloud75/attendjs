import Device from '../models/Device.js'

export const searchDevice = async (req,res,next) => {
    try {
        const name = req.query.name 
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let devices
        // [문제] endDate: 이름 검색시에만 실행
        if (name && name !== '') {
            devices = await Device.find({name}).sort({ipStr: 1})
        }
        else { 
            devices = await Device.find({}).sort({ipStr: 1, mac: 1});
        }; 
        console.log('device', devices)
        res.status(200).json(devices);
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}
