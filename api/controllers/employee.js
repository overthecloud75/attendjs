import Employee from '../models/Employee.js'
import User from '../models/User.js'
import { sanitizeData } from '../utils/util.js'

const RETIRED_STATUS = '퇴사'

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
        const { _id, beginDate: rawBeginDate, email, department, rank, position, regular, mode, attendMode, cardNo } = req.body
        const beginDate = sanitizeData(rawBeginDate, 'date')
        await Employee.updateOne({_id}, {$set: {beginDate, email, department, rank, position, regular, mode, attendMode, cardNo}}, { runValidators: true})
        // 퇴사하는 경우 id 삭제 
        if (regular === RETIRED_STATUS ) {
            await User.deleteOne({email})
        }
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export const write = async (req,res,next) => {
    try {
        const { employeeId: rawEmployeeId, name, beginDate: rawBeginDate, email, department, rank, position, regular, mode, attendMode, cardNo } = req.body
        const employeeId = Number(rawEmployeeId)
        const beginDate = sanitizeData(rawBeginDate, 'date')
        const newEmployee = new Employee({employeeId, name, beginDate, email, department, rank, position, regular, mode, attendMode, cardNo})
        await newEmployee.save()
        res.status(200).json(newEmployee)
    } catch (err) {
        next(err)
    }
}

export const deleteEmployee = async (req,res,next) => {
    try {
        const { _id } = req.body
        const employee = await Employee.deleteOne({_id})
        res.status(200).json(employee)
    } catch (err) {
        next(err)
    }
}

const getEmployees = async (req) => {
    const name = req.query.name
    const isAdmin = req.user.isAdmin
    // const startDate = sanitizeData(req.query.startDate, 'date')
    // const endDate = sanitizeData(req.query.endDate, 'date')
    let employees
    if (name) {
        employees = await Employee.find({name, regular: {$ne: RETIRED_STATUS}}, {cardNo: 0}).sort({name: 1})
    } else { 
        if (isAdmin) {
            employees = await Employee.find({regular: {$ne: RETIRED_STATUS}}).sort({name: 1})
        } else {
            employees = await Employee.find({regular: {$ne: RETIRED_STATUS}}, {cardNo: 0}).sort({name: 1})
        }
    }
    return employees
}

export const getEmployeeByEmail = async (email) => {
    // 퇴사자가 아닌 경우에만 이메일 중복 허용하지 않음 
    const employee = await Employee.findOne({email, regular: {$ne: RETIRED_STATUS}})
    return employee 
}