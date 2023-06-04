import { logger, reqFormat } from '../config/winston.js'
import { getAttends } from './attend.js'
import Report from '../models/Report.js'
import Employee from '../models/Employee.js'
import { WORKING, getReverseStatus } from '../config/WORKING.js'
import { getToday, getDefaultAnnualLeave } from '../utils/util.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const reverseStatus = getReverseStatus()

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
                for (const inStatus of WORKING.inStatus){
                    summary[attend.employeeId][inStatus] = 0 
                }
                for (const outStatus of Object.keys(WORKING.outStatus)){
                    summary[attend.employeeId][outStatus] = 0 
                }
            }
            summary[attend.employeeId].days = summary[attend.employeeId].days + 1  
            summary[attend.employeeId].workingHours = summary[attend.employeeId].workingHours + attend.workingHours
            if (attend.status) {
                summary[attend.employeeId][attend.status] = summary[attend.employeeId][attend.status] + 1
            }
            if (attend.reason) {
                summary[attend.employeeId][reverseStatus[attend.reason]] = summary[attend.employeeId][reverseStatus[attend.reason]] + 1
            }
        }
        for (const id of Object.keys(summary)) {
            summary[id].workingHours = Math.round(summary[id].workingHours * 10) / 10
            summary[id].workingDays = summary[id].days
            for (const key of Object.keys(summary[id])) {
                if (Object.keys(WORKING.offDay).includes(key)) {
                    summary[id].workingDays = summary[id].workingDays - summary[id][key] * WORKING.offDay[key]
                }
            }
            summary[id].workingDays = Math.round(summary[id].workingDays * 100) / 100
            summaryList.push(summary[id])
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        console.log('err', err)
        next(err);
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
    logger.info(reqFormat(req))
    try {      
        const employee = await Employee.findOne({email: req.user.email})
        const summary = await getLeftLeaveSummary(employee)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summary)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const getLeftLeaveList = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const employees = await Employee.find({regular: {$ne: '퇴사'}}).sort({name: 1})
        let summaryList = []
        for (const employee of employees) {
            const summary = await getLeftLeaveSummary(employee)
            if (summary) {summaryList.push(summary)}
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(summaryList)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const getLeftLeaveSummary = async (employee) => {
    const reverseStatus = getReverseStatus()
    let summary 
    if (employee.beginDate) {
        const {defaultAnnualLeave, baseDate, baseMonth} = getDefaultAnnualLeave(employee.beginDate)
        summary = {name: employee.name, beginDate: employee.beginDate, baseDate, baseMonth, defaultAnnualLeave, leftAnnualLeave: defaultAnnualLeave}
        for (const inStatus of WORKING.inStatus){
            if (Object.keys(WORKING.offDay).includes(inStatus)) {summary[inStatus] = 0} 
        }
        for (const outStatus of Object.keys(WORKING.outStatus)){
            if (Object.keys(WORKING.offDay).includes(outStatus)) {summary[outStatus] = 0}
        }
        const attends = await Report.find({employeeId: employee.employeeId, date: {$gte: baseDate, $lte: getToday()}}).sort({date: 1})
        for (const attend of attends) {
            if (attend.status && Object.keys(WORKING.offDay).includes(attend.status)) {
                summary[attend.status] = summary[attend.status] + 1
                summary.leftAnnualLeave = summary.leftAnnualLeave - WORKING.offDay[attend.status]
            }
            if (attend.reason && Object.keys(WORKING.offDay).includes(attend.reason)) {
                summary[reverseStatus[attend.reason]] = summary[reverseStatus[attend.reason]] + 1
                summary.leftAnnualLeave = summary.leftAnnualLeave - WORKING.offDay[attend.reason]
            }
        }
    }
    return summary
}

