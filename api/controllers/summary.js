import { getAttends } from './attend.js'
import Report from '../models/Report.js'
import Employee from '../models/Employee.js'
import { getToday, getNextDay, getNextYear, getDefaultAnnualLeave } from '../utils/util.js'
import { WORKING, getReverseStatus } from '../config/working.js'
import { getApprovalLeaveHistoryByEmployeeId } from './attendApproval.js'

const RETIRED_STATUS = '퇴사'

export const search = async (req, res, next) => {
    try {
        const attends = await getAttends(req)
        const summary = summarizeAttends(attends)
        const summaryList = summaryWorkingHours(summary)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        next(err)
    }
}

const summarizeAttends = (attends) => {
    const summary = {}
    for (const attend of attends) {
        const { employeeId, name, workingHours, status, reason } = attend
        if (!(String(employeeId) in summary)) {
            summary[employeeId] = initializeSummary(employeeId, name)
        }
        updateSummary(summary[employeeId], workingHours, status, reason)
    }
    return summary
}

const initializeSummary = (employeeId, name) => {
    const summary = { employeeId, name, days: 0, workingHours: 0 }
    WORKING.inStatus.forEach(inStatus => { summary[inStatus] = 0 })
    Object.keys(WORKING.outStatus).forEach(outStatus => { summary[outStatus] = 0 })
    return summary
}

const updateSummary = (summary, workingHours, status, reason) => {
    summary.days++
    summary.workingHours += workingHours
    if (status) summary[status]++
    if (reason === '출근') summary['정상출근']++
    else if (reason) summary[reason]++
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

export const getLeftLeave = async (req,res,next) => {
    try {      
        const employee = await Employee.findOne({email: req.user.email})
        const summary = await getLeftLeaveSummary(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summary)
    } catch (err) {
        next(err)
    }
}

export const getLeftLeaveList = async (req,res,next) => {
    try {
        const employees = await Employee.find({regular: {$ne: RETIRED_STATUS}}).sort({name: 1})
        const summaryList = await Promise.all(employees.map(getLeftLeaveSummary))
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        next(err)
    }
}

export const getLeftLeaveSummary = async ({employeeId, name, beginDate}) => {
    if (!beginDate) return null

    const reverseStatus = getReverseStatus()
   
    const {defaultAnnualLeave, baseDate, baseMonth} = getDefaultAnnualLeave(beginDate)
    const nextYearDay = getNextYear(baseDate)
    const summary = initializeLeftLeaveSummary(name, beginDate, baseDate, baseMonth, defaultAnnualLeave)
    const attends = await Report.find({employeeId, date: {$gte: baseDate, $lte: getToday()}}).sort({date: 1})
    const approvalHistory = await getApprovalLeaveHistoryByEmployeeId(employeeId, getToday(), nextYearDay)
    updateLeftLeaveSummary(summary, attends, reverseStatus, approvalHistory, nextYearDay)
    return summary
}

const initializeLeftLeaveSummary = (name, beginDate, baseDate, baseMonth, defaultAnnualLeave) => {
    const summary = { name, beginDate, baseDate, baseMonth, defaultAnnualLeave, leftAnnualLeave: defaultAnnualLeave, notUsed: 0, pending: 0 }
    WORKING.inStatus.concat(Object.keys(WORKING.outStatus)).forEach(status => {
        if (status in WORKING.offDay) summary[status] = 0
    })
    return summary
}

const updateLeftLeaveSummary = (summary, attends, reverseStatus, approvalHistory, nextYearDay) => {
    for (const attend of attends) {
        const { status, reason } = attend
        if (status && status in WORKING.offDay) {
            summary[status]++
            summary.leftAnnualLeave -= WORKING.offDay[status]
        }
        if (reason && reason in WORKING.offDay) {
            summary[reverseStatus[reason]]++
            summary.leftAnnualLeave -= WORKING.offDay[reason]
        }
    }
    for (const approval of approvalHistory){
        let baseDay = approval.start 
        while (baseDay <= approval.end && baseDay < nextYearDay) {
            if (approval.status === 'Active') {
                if (approval.reason === '휴가') {
                    summary.notUsed = summary.notUsed + 1
                } else if (approval.reason === '반차') {
                    summary.notUsed = summary.notUsed + 0.5
                }
            }
            else if (approval.status === 'Pending') {
                if (approval.reason === '휴가') {
                    summary.pending = summary.pending + 1
                } else if (approval.reason === '반차') {
                    summary.pending = summary.pending + 0.5
                }
            }
            baseDay = getNextDay(baseDay)
        }
        summary.leftAnnualLeave = summary.leftAnnualLeave - summary.notUsed
    }
}

const summaryWorkingHours = (summary) => {
    let summaryList = []
    for (const id in summary) {
        summary[id].workingHours = Math.round(summary[id].workingHours * 10) / 10
        summary[id].workingDays = summary[id].days
        for (const key in summary[id]) {
            if (key in WORKING.offDay) {
                summary[id].workingDays = summary[id].workingDays - summary[id][key] * WORKING.offDay[key]
            }
        }
        summary[id].workingDays = Math.round(summary[id].workingDays * 100) / 100
        summaryList.push(summary[id])
    }
    return summaryList 
}
