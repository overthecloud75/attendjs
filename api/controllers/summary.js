import { getAttends } from './attend.js'
import Employee from '../models/Employee.js'
import AttendanceSummaryService from '../services/AttendanceSummaryService.js'
import LeaveService from '../services/LeaveService.js'

const RETIRED_STATUS = '퇴사'

export const search = async (req, res, next) => {
    try {
        const attends = await getAttends(req)
        const summary = AttendanceSummaryService.summarizeAttends(attends)
        const summaryList = AttendanceSummaryService.summaryWorkingHours(summary)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        next(err)
    }
}

// https://www.saramin.co.kr/zf_user/tools/holi-calculator
/* 
    연차/휴가 산정 기준 : 
    1년 미만 근무 시
    *17.05.30 이후 입사자부터 1개월 개근 시 유급휴가 1일씩 부여, 발생월로부터 1년간 사용가능
    *20.03.31 이후 발생하는 연차는 입사일로부터 1년간 사용가능
    1개월 개근하여 부여받은 유급휴가는 1년간 사용하지 않을 경우 유효기간 만료로 소멸
    1년간 80% 이상 출근시: 유급휴가 15일 부여
    3년 이상 계속 근무시: 최초 1년을 초과하는 매 2년에 대하여 유급휴가 1일을 가산 (최대 25일 한도)
    1년 미만 또는 1년간 80% 미만 출근시: 1개월 만근 시 유급휴가 1일 부여
*/

export const getLeftLeave = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({ email: req.user.email })
        const summary = await LeaveService.getLeftLeaveSummary(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summary)
    } catch (err) {
        next(err)
    }
}

export const getLeftLeaveList = async (req, res, next) => {
    try {
        const { name } = req.query
        let employees
        if (name) {
            employees = await Employee.find({ name })
        } else {
            employees = await Employee.find({ regular: { $ne: RETIRED_STATUS } }).sort({ name: 1 })
        }
        const summaryList = await Promise.all(employees.map(emp => LeaveService.getLeftLeaveSummary(emp)))

        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        next(err)
    }
}
