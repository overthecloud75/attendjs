import Report from "../models/Report.js";

export const searchAttend = async (req,res,next)=>{
    try {
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let attends
        if (req.query.name && req.query.name !== "") {
            attends = await Report.find({name: req.query.name, date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1});
        }
        else { 
            attends = await Report.find({date: {$gte: startDate, $lte: endDate}}).sort({name: 1, date: 1});
        }; 
        console.log(attends)
        res.status(200).json(attends);
    } catch (err) {
        next(err);
    }
}
