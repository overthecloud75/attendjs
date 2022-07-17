import Report from "../models/Report.js";

export const searchAttend = async (req,res,next)=>{
    try {
        var newDate = new Date();
        var startDate = req.query.startDate
        var endDate = req.query.endDate
        let attend
        if (req.query.name && req.query.name !== "") {
            attend = await Report.find({name: req.query.name, date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1});
        }
        else { 
            attend = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1});
        }; 
        console.log(newDate, attend)
        res.status(200).json(attend);
    } catch (err) {
        next(err);
    }
}
