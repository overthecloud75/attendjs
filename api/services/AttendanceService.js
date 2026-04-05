import Report from '../models/Report.js'
import { sanitizeData } from '../utils/util.js'

/**
 * Service Layer for Attendance (Report) Queries
 */
export default class AttendanceService {
    /**
     * Gets attendance records (Reports) based on query parameters
     */
    static async getAttends(query) {
        const { name, startDate: rawStart, endDate: rawEnd } = query
        const startDate = sanitizeData(rawStart, 'date')
        const endDate = sanitizeData(rawEnd, 'date')

        const baseQuery = { date: { $gte: startDate, $lte: endDate } }
        if (name) baseQuery.name = name

        return await Report.find(baseQuery).sort({ name: 1, date: 1 })
    }
}
