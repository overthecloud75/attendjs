import LeaveService from '../services/LeaveService.js'
import LeaveHistory from '../models/LeaveHistory.js'
import Employee from '../models/Employee.js'
import Report from '../models/Report.js'
import Approval from '../models/Approval.js'
import { logger } from '../config/winston.js'

const runLeaveMigration = async () => {
    try {
        const count = await LeaveHistory.countDocuments()
        if (count > 0) {
            logger.info('Leave Migration skipped: Data already exists.')
            return
        }

        logger.info('Starting Leave Migration (Full History)...')
        const employees = await Employee.find({ regular: { $ne: '퇴사' } })

        let migratedCount = 0
        for (const emp of employees) {
            if (!emp.beginDate) continue

            // 전체 근속 기간에 대해 루프 (입사일 ~ 현재 연도 차이 + 여유분)
            const beginYear = new Date(emp.beginDate).getFullYear()
            const thisYear = new Date().getFullYear()
            const maxYears = thisYear - beginYear + 2 // 넉넉하게 잡음 (내부에서 날짜 체크함)

            for (let offset = 0; offset < maxYears; offset++) {
                if (offset === 0) {
                    await migrateCurrentYear(emp)
                } else {
                    await migratePastYear(emp, offset)
                }
            }
            migratedCount++
        }

        logger.info(`Leave Migration Completed. Migrated ${migratedCount} employees.`)

    } catch (err) {
        logger.error(`Leave Migration Failed: ${err.message}`)
    }
}

// 올해 (현재 유효한 연차) - Legacy Logic 활용
const migrateCurrentYear = async (emp) => {
    try {
        const summary = await LeaveService.getLegacyLeftLeaveSummary({
            employeeId: emp.employeeId,
            name: emp.name,
            beginDate: emp.beginDate
        })

        const totalDays = summary.defaultAnnualLeave
        const futureUsed = summary.notUsed
        const left = summary.leftAnnualLeave
        let pastUsed = totalDays - left - futureUsed
        pastUsed = Math.max(0, parseFloat(pastUsed.toFixed(1)))

        const grantDate = new Date(summary.baseDate)
        const expiryDate = new Date(grantDate)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)

        await new LeaveHistory({
            employeeId: emp.employeeId,
            nthYear: summary.employeementPeriod,
            type: 'annual',
            totalDays: totalDays,
            usedDays: pastUsed,
            grantDate: grantDate,
            expiryDate: expiryDate
        }).save()
    } catch (err) {
        logger.warn(`Migration Error (Current Year) for ${emp.name}: ${err.message}`)
    }
}

// 과거 (만료된 연차) - Log 계산 활용
const migratePastYear = async (emp, offset) => {
    try {
        // 1. Grant Date 계산
        const summary = await LeaveService.getLegacyLeftLeaveSummary({
            employeeId: emp.employeeId,
            beginDate: emp.beginDate
        })
        const currentBaseDate = new Date(summary.baseDate)
        const targetGrantDate = new Date(currentBaseDate)
        targetGrantDate.setFullYear(targetGrantDate.getFullYear() - offset)

        // 입사일보다 더 과거면 스킵 (Loop 종료 조건 역할도 수행)
        const beginDate = new Date(emp.beginDate)
        if (targetGrantDate < beginDate) return

        // 2. 근속연수 및 TotalDays 계산
        let nthYear = summary.employeementPeriod - offset
        if (nthYear < 0) return

        const totalDays = calculateTotalDays(nthYear)
        if (totalDays <= 0) return

        // 3. 실제 사용량 계산 (Report + Approval)
        const nextYearDate = new Date(targetGrantDate)
        nextYearDate.setFullYear(nextYearDate.getFullYear() + 1)

        const usedDays = await calculateUsageFromLogs(emp.employeeId, targetGrantDate, nextYearDate)

        // 4. 저장 (단, expired 상태로)
        await new LeaveHistory({
            employeeId: emp.employeeId,
            nthYear: nthYear,
            type: 'annual',
            totalDays: totalDays,
            usedDays: usedDays,
            grantDate: targetGrantDate,
            expiryDate: nextYearDate
        }).save()

    } catch (err) {
        logger.warn(`Migration Error (Past Year -${offset}) for ${emp.name}: ${err.message}`)
    }
}

const calculateTotalDays = (nthYear) => {
    if (nthYear < 1) return 0

    let days = 15 + Math.floor((nthYear - 1) / 2)
    if (days > 25) days = 25
    return days
}

const calculateUsageFromLogs = async (employeeId, start, end) => {
    const activeApprovals = await Approval.find({
        employeeId,
        status: { $in: ['Active', 'Completed'] },
        reason: { $in: ['휴가', '반차'] },
        start: { $gte: toDateString(start), $lt: toDateString(end) }
    })

    let count = 0
    for (const app of activeApprovals) {
        if (app.reason === '휴가') count += 1
        else if (app.reason === '반차') count += 0.5
    }

    return count
}

const toDateString = (date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

export default runLeaveMigration
