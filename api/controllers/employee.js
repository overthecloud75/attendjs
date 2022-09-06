import { logger, reqFormat } from '../config/winston.js'
import Employee from '../models/Employee.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let employees
        if (name && name !== '') {
            employees = await Employee.find(
                {name, $or:[{endDate: {$gt: endDate}}, {endDate: {$exists: false}}]}).sort({name: 1})
        }
        else { 
            employees = await Employee.find(
                {$or:[{endDate: {$gt: endDate}}, {endDate: {$exists: false}}]}).sort({name: 1});
        }
        console.log('employees', employees)
        res.status(200).json(employees)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}