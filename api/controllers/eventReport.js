import ReportService from '../services/ReportService.js'

/**
 * Controller for Attendance Report logic.
 * Delegating to ReportService.
 */

export const calculateWorkingHours = (begin, end) => ReportService.calculateWorkingHours(begin, end)

export const reportUpdate = async (action, event, start, end) => {
    return ReportService.reportUpdate(action, event, start, end)
}