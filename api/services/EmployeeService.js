import Employee from '../models/Employee.js'
import { EMPLOYEE_STATUS, WORK_MODE } from '../config/domain.js'

/**
 * Service Layer for Employee Management and Queries
 */
export default class EmployeeService {
    // Global Status Constants - Using centralized domain.js
    static STATUS = EMPLOYEE_STATUS
    static MODE = WORK_MODE

    /**
     * Finds an employee by their unique email address
     */
    static async getEmployeeByEmail(email) {
        return await Employee.findOne({ email })
    }

    /**
     * Finds an employee by their employeeId
     */
    static async getEmployeeById(employeeId) {
        return await Employee.findOne({ employeeId })
    }

    /**
     * Returns all active (non-retired) employees sorted by name
     */
    static async getActiveEmployees(query = {}) {
        const baseQuery = { 
            regular: { $ne: this.STATUS.RETIRED },
            ...query
        }
        return await Employee.find(baseQuery).sort({ name: 1 })
    }

    /**
     * Checks if an employee is retired
     */
    static isRetired(employee) {
        return employee.regular === this.STATUS.RETIRED
    }

    /**
     * Shared logic to validate if an employee exists and is active for login/registration
     */
    static async validateActiveEmployee(email, name = null) {
        const employee = await this.getEmployeeByEmail(email)
        
        if (!employee) return { valid: false, reason: 'Employee not found' }
        if (this.isRetired(employee)) return { valid: false, reason: 'Employee is retired' }
        if (name && employee.name !== name) return { valid: false, reason: 'Name mismatch' }
        
        return { valid: true, employee }
    }
}
