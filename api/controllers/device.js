import Device from '../models/Device.js'

export const search = async (req,res,next) => {
    try {
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
        }; 
        res.status(200).json(devices);
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}
