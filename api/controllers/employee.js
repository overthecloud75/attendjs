import Employee from '../models/Employee.js'
import User from '../models/User.js'
import { sanitizeData } from '../utils/util.js'

export const search = async (req, res, next) => {
    try {
        const employees = await getEmployees(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(employees)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
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
        await Employee.updateOne({_id}, {$set: {beginDate, email, department, rank, position, regular, mode, attendMode}}, { runValidators: true})
        // 퇴사하는 경우 id 삭제 
        if (regular === '퇴사') {
            await User.deleteOne({email})
        }
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export const write = async (req,res,next) => {
    try {
        const employeeId = Number(req.body.employeeId)
        const name = req.body.name
        const beginDate = sanitizeData(req.body.beginDate, 'date')
        const email = req.body.email
        const department = req.body.department
        const rank = req.body.rank
        const position = req.body.position
        const regular = req.body.regular
        const mode = req.body.mode 
        const attendMode = req.body.attendMode

        const newEmployee = Employee({employeeId, name, beginDate, email, department, rank, position, regular, mode, attendMode})
        await newEmployee.save()
        res.status(200).json(newEmployee)
    } catch (err) {
        next(err)
    }
}

export const deleteEmployee = async (req,res,next) => {
    try {
        const _id = req.body._id
        const employee = await Employee.deleteOne({_id})
        res.status(200).json(employee)
    } catch (err) {
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
    // 퇴사자가 아닌 경우에만 이메일 중복 허용하지 않음 
    const employee = await Employee.findOne({email, regular: {$ne: '퇴사'}})
    return employee 
}