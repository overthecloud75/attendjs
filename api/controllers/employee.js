import { logger, reqFormat } from '../config/winston.js'
import Employee from '../models/Employee.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const employees = await getEmployees(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(employees)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

export const update = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const _id = req.body._id
        const beginDate = sanitizeData(req.body.beginDate, 'date')
        const email = req.body.email
        const department = req.body.department
        const rank = req.body.rank
        const position = req.body.position
        const regular = req.body.regular
        const mode = req.body.mode 
        const attendMode = req.body.attendMode
        const employee = await Employee.updateOne({_id}, {$set: {beginDate, email, department, rank, position, regular, mode, attendMode}})
        res.status(200).json(employee)
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}

const getEmployees = async (req) => {
    const name = req.query.name
    // const startDate = sanitizeData(req.query.startDate, 'date')
    // const endDate = sanitizeData(req.query.endDate, 'date')
    let employees
    if (name) {
        employees = await Employee.find({name, regular: {$ne: '퇴사'}}).sort({name: 1})
    } else { 
        employees = await Employee.find({regular: {$ne: '퇴사'}}).sort({name: 1})
    }
    return employees
}

export const getEmployeeByEmail = async (email) => {
    const employee = await Employee.findOne({email})
    return employee 
}