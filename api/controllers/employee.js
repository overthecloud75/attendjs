import Employee from '../models/Employee.js'
import User from '../models/User.js'
import { sanitizeData } from '../utils/util.js'
import EmployeeService from '../services/EmployeeService.js'

/**
 * Controller for Employee management
 */

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
        const { _id, beginDate: rawBeginDate, email, mobileNo: mobileNoStr, department, rank, position, regular, mode, attendMode, cardNo } = req.body
        const beginDate = sanitizeData(rawBeginDate, 'date')
        const mobileNo = sanitizeData(mobileNoStr, 'mobile')
        await Employee.updateOne({ _id }, { $set: { beginDate, email, mobileNo, department, rank, position, regular, mode, attendMode, cardNo } }, { runValidators: true })
        
        // 퇴사하는 경우 User 계정도 삭제 
        if (regular === EmployeeService.STATUS.RETIRED) {
            await User.deleteOne({ email })
        }
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export const write = async (req, res, next) => {
    try {
        const { employeeId: rawEmployeeId, name, beginDate: rawBeginDate, email, department, rank, position, regular, mode, attendMode, cardNo } = req.body
        const employeeId = Number(rawEmployeeId)
        const beginDate = sanitizeData(rawBeginDate, 'date')
        const newEmployee = new Employee({ employeeId, name, beginDate, email, department, rank, position, regular, mode, attendMode, cardNo })
        await newEmployee.save()
        res.status(200).json(newEmployee)
    } catch (err) {
        next(err)
    }
}

export const deleteEmployee = async (req, res, next) => {
    try {
        const { _id } = req.body
        const employee = await Employee.deleteOne({ _id })
        res.status(200).json(employee)
    } catch (err) {
        next(err)
    }
}

const getEmployees = async (req) => {
    const name = req.query.name
    const isAdmin = req.user.isAdmin
    
    let query = {}
    if (name) query.name = name

    // 관리자가 아닌 경우 cardNo 필드 제외 (기존 로직 유지)
    if (isAdmin) {
        return await EmployeeService.getActiveEmployees(query)
    } else {
        return await Employee.find({ ...query, regular: { $ne: EmployeeService.STATUS.RETIRED } }, { cardNo: 0 }).sort({ name: 1 })
    }
}

/**
 * Proxy for legacy internal calls or other services
 */
export const getEmployeeByEmail = async (email) => {
    return await EmployeeService.validateActiveEmployee(email).then(res => res.employee)
}