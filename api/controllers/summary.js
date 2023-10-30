import { getAttends } from './attend.js'
import Report from '../models/Report.js'
import Employee from '../models/Employee.js'
import { WORKING, getReverseStatus } from '../config/working.js'
import { getToday, getDefaultAnnualLeave } from '../utils/util.js'

export const search = async (req,res,next) => {
    try {
        let summaryList = []
        let summary = {}
        const attends = await getAttends(req)

        for (const attend of attends) {
            if (!Object.keys(summary).includes(String(attend.employeeId))) {
                summary[attend.employeeId] = {
                    employeeId: attend.employeeId, 
                    name: attend.name, 
                    days: 0,
                    workingHours: 0
                }
                WORKING.inStatus.forEach(inStatus => {summary[attend.employeeId][inStatus] = 0})
                for (const outStatus in WORKING.outStatus){
                    summary[attend.employeeId][outStatus] = 0 
                }
            }
            summary[attend.employeeId].days++  
            summary[attend.employeeId].workingHours = summary[attend.employeeId].workingHours + attend.workingHours
            if (attend.status) { summary[attend.employeeId][attend.status]++ }
           
            if (attend.reason === '출근') { summary[attend.employeeId]['정상출근']++ 
            } else if (attend.reason) {
                summary[attend.employeeId][attend.reason]++
            }
        }
        for (const id in summary) {
            summary[id].workingHours = Math.round(summary[id].workingHours * 10) / 10
            summary[id].workingDays = summary[id].days
            for (const key in summary[id]) {
                if (Object.keys(WORKING.offDay).includes(key)) {
                    summary[id].workingDays = summary[id].workingDays - summary[id][key] * WORKING.offDay[key]
                }
            }
            summary[id].workingDays = Math.round(summary[id].workingDays * 100) / 100
            summaryList.push(summary[id])
        }
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
        const employees = await Employee.find({regular: {$ne: '퇴사'}}).sort({name: 1})
        let summaryList = []
        for (const employee of employees) {
            const summary = await getLeftLeaveSummary(employee)
            if (summary) {summaryList.push(summary)}
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        next(err)
    }
}

export const getLeftLeaveSummary = async ({employeeId, name, beginDate}) => {
    const reverseStatus = getReverseStatus()
    let summary 
    if (beginDate) {
        const {defaultAnnualLeave, baseDate, baseMonth} = getDefaultAnnualLeave(beginDate)
        summary = {name, beginDate, baseDate, baseMonth, defaultAnnualLeave, leftAnnualLeave: defaultAnnualLeave}
        
        for (const inStatus of WORKING.inStatus){
            if (Object.keys(WORKING.offDay).includes(inStatus)) {summary[inStatus] = 0} 
        }
        for (const outStatus in WORKING.outStatus){
            if (Object.keys(WORKING.offDay).includes(outStatus)) {summary[outStatus] = 0}
        }
        const attends = await Report.find({employeeId, date: {$gte: baseDate, $lte: getToday()}}).sort({date: 1})
        for (const attend of attends) {
            if (attend.status && Object.keys(WORKING.offDay).includes(attend.status)) {
                summary[attend.status]++
                summary.leftAnnualLeave = summary.leftAnnualLeave - WORKING.offDay[attend.status]
            }
            if (attend.reason && Object.keys(WORKING.offDay).includes(attend.reason)) {
                summary[reverseStatus[attend.reason]]++
                summary.leftAnnualLeave = summary.leftAnnualLeave - WORKING.offDay[attend.reason]
            }
        }
    }
    return summary
}

