import { WORKING, getReverseStatus } from '../config/working.js'
import { logger } from '../config/winston.js'
import Report from '../models/Report.js'
import LeaveHistory from '../models/LeaveHistory.js'
import { getToday, getNextDay, getNextYear, getDefaultAnnualLeave } from '../utils/util.js'
import { getApprovalLeaveHistoryByEmployeeId } from '../controllers/attendApproval.js' // Consider refactoring if possible

export default class LeaveService {

    static async getLeftLeaveSummary({ employeeId, name, beginDate }) {
        if (!beginDate) return null

        // 1. [Legacy] 기존 로직으로 요약 정보 계산 (Summary 화면용 - Golden Source)
        const summary = await this.getLegacyLeftLeaveSummary({ employeeId, name, beginDate })

        // 2. [New] DB에서 연차 이력 조회 (상세 모달용)
        // 만료된 내역 포함 전체 조회
        const histories = await LeaveHistory.find({
            employeeId
        }).sort({ grantDate: -1 }).limit(3)

        // 3. Legacy 결과에 History 리스트만 추가하여 반환
        return {
            ...summary,
            leaveHistory: histories || [] // 이력이 없으면 빈 배열
        }
    }

    // 기존 로직을 Fallback용으로 이름 변경하여 보존
    static async getLegacyLeftLeaveSummary({ employeeId, name, beginDate }) {
        const reverseStatus = getReverseStatus()

        const { defaultAnnualLeave, employeementPeriod, baseDate, baseMonth } = getDefaultAnnualLeave(beginDate)
        const nextYearDay = getNextYear(baseDate)
        const summary = this.initializeLeftLeaveSummary(name, employeeId, beginDate, baseDate, baseMonth, defaultAnnualLeave, employeementPeriod)
        const attends = await Report.find({ employeeId, date: { $gte: baseDate, $lte: getToday() } }).sort({ date: 1 })
        const approvalHistory = await getApprovalLeaveHistoryByEmployeeId(employeeId, getToday(), nextYearDay)
        this.updateLeftLeaveSummary(summary, attends, reverseStatus, approvalHistory, nextYearDay)
        return summary
    }

    // [New] 연차 부여 (Scheduler에서 호출)
    static async grantLeave(employee, grantInfo) {
        const { type, nthYear, days } = grantInfo

        // 중복 부여 방지
        const exists = await LeaveHistory.findOne({
            employeeId: employee.employeeId,
            nthYear,
            type
        })

        if (exists) return

        const grantDate = new Date()
        const expiryDate = new Date()
        expiryDate.setFullYear(expiryDate.getFullYear() + 1) // 1년 유효

        await new LeaveHistory({
            employeeId: employee.employeeId,
            nthYear,
            type,
            totalDays: days,
            usedDays: 0,
            grantDate,
            expiryDate
        }).save()
    }

    // [New] 연차 사용 처리 (Scheduler에서 매일 자정에 '어제' 날짜로 호출)
    static async deductLeave(targetDate) {
        // 1. 해당 날짜에 휴가/반차를 사용한(Active) 내역 조회
        const approvals = await Approval.find({
            status: 'Active',
            reason: { $in: ['휴가', '반차', '병가'] },
            start: { $lte: targetDate },
            end: { $gte: targetDate }
        })

        for (const app of approvals) {
            const deduction = WORKING.offDay[app.reason] || 0

            if (deduction === 0) continue

            // 2. 차감할 연차 이력 조회 (유효기간 남은 것 전체 조회 - 잔여 없어도 조회해야 마이너스 처리 가능)
            const histories = await LeaveHistory.find({
                employeeId: app.employeeId,
                expiryDate: { $gt: targetDate }
            }).sort({ grantDate: 1 }) // 먼저 받은 연차부터 차감

            // 이력이 아예 없으면 차감 불가 (경고)
            if (histories.length === 0) {
                console.warn(`[LeaveService] No leave history found for employee ${app.employeeId}. Cannot deduct.`)
                continue
            }

            // 3. 순차 차감
            for (const h of histories) {
                if (deduction <= 0) break

                const available = h.totalDays - h.usedDays
                if (available > 0) {
                    if (available >= deduction) {
                        h.usedDays += deduction
                        deduction = 0
                    } else {
                        h.usedDays += available
                        deduction -= available
                    }
                    await h.save()
                }
            }

            // 4. 모든 이력을 다 털었는데도 차감량이 남았으면 -> 마지막 이력(가장 최근 연차)에서 마이너스 처리(가불)
            if (deduction > 0) {
                const searchLast = histories[histories.length - 1]
                searchLast.usedDays += deduction
                await searchLast.save()
                logger.debug(`[LeaveService] Negative leave balance applied for employee ${app.employeeId}. Overdraft: ${deduction}`)
            }
        }
    }

    // [New] 특정 휴가 건에 대해 연차 차감 (Late Approval 대응용)
    static async deductLeaveForApproval(approval) {
        const deduction = WORKING.offDay[approval.reason] || 0

        if (deduction === 0) return

        // 차감할 연차 이력 조회 (FIFO, 잔여 상관없이 전체 조회)
        const histories = await LeaveHistory.find({
            employeeId: approval.employeeId,
            expiryDate: { $gt: approval.start }
        }).sort({ grantDate: 1 })

        if (histories.length === 0) {
            console.warn(`[LeaveService] No leave history found for employee ${approval.employeeId}. Cannot deduct.`)
            return
        }

        for (const h of histories) {
            if (deduction <= 0) break
            const available = h.totalDays - h.usedDays
            if (available > 0) {
                if (available >= deduction) {
                    h.usedDays += deduction
                    deduction = 0
                } else {
                    h.usedDays += available
                    deduction -= available
                }
                await h.save()
            }
        }

        // 초과 사용분 마이너스 처리
        if (deduction > 0) {
            const lastHistory = histories[histories.length - 1]
            lastHistory.usedDays += deduction
            await lastHistory.save()
            logger.debug(`[LeaveService] Negative leave balance applied via Late Approval for employee ${approval.employeeId}. Overdraft: ${deduction}`)
        }
    }

    // [New] 연차 취소 시 환급 처리 (Approval Controller에서 호출)
    static async refundLeave(approval) {
        const refund = WORKING.offDay[approval.reason] || 0

        if (refund === 0) return

        // usedDays가 있는 이력 조회 (최근에 부여받은 것부터 역순으로 채워넣기? 혹은 유효기간 넉넉한 곳으로 원복?)
        // 전략: 나중에 부여받은(GrantDate DESC) 기록에서 차감된 것을 먼저 취소해준다. 
        // -> 이러면 유효기간 짧은 옛날 연차를 "사용함"으로 유지하고, 유효기간 긴 최신 연차를 "미사용"으로 돌려주게 됨 (직원에게 유리)
        const histories = await LeaveHistory.find({
            employeeId: approval.employeeId,
            usedDays: { $gt: 0 }
        }).sort({ grantDate: -1 })

        for (const h of histories) {
            if (refund <= 0) break

            if (h.usedDays >= refund) {
                h.usedDays -= refund
                refund = 0
            } else {
                refund -= h.usedDays
                h.usedDays = 0
            }
            await h.save()
        }

        if (refund > 0) {
            console.warn(`[LeaveService] Cannot refund full amount for employee ${approval.employeeId}. Remaining refund: ${refund}`)
        }
    }

    static initializeLeftLeaveSummary(name, employeeId, beginDate, baseDate, baseMonth, defaultAnnualLeave, employeementPeriod) {
        const summary = { name, employeeId, beginDate, baseDate, baseMonth, defaultAnnualLeave, employeementPeriod, leftAnnualLeave: defaultAnnualLeave, notUsed: 0, pending: 0 }
        WORKING.inStatus.concat(Object.keys(WORKING.outStatus)).forEach(status => {
            if (status in WORKING.offDay) summary[status] = 0
        })
        return summary
    }

    static updateLeftLeaveSummary(summary, attends, reverseStatus, approvalHistory, nextYearDay) {
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
        for (const approval of approvalHistory) {
            let baseDay = approval.start
            while (baseDay <= approval.end && baseDay < nextYearDay) {
                const deduction = WORKING.offDay[approval.reason] || 0
                if (approval.status === 'Active') {
                    summary.notUsed += deduction
                }
                else if (approval.status === 'Pending') {
                    summary.pending += deduction
                }
                baseDay = getNextDay(baseDay)
            }
        }
        summary.leftAnnualLeave = summary.leftAnnualLeave - summary.notUsed
    }
}
