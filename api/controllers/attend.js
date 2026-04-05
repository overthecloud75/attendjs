import AttendanceService from '../services/AttendanceService.js'

/**
 * Controller for Attendance queries (Reports)
 */

export const search = async (req, res, next) => {
    try {
        const attends = await AttendanceService.getAttends(req.query)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(attends)
    } catch (err) {
        next(err)
    }
}


