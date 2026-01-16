import cron from 'node-cron'
import LeaveService from '../services/LeaveService.js'
import Employee from '../models/Employee.js'
import { logger } from '../config/winston.js'

// 매일 자정 (00:00) 실행
const startLeaveScheduler = () => {
    logger.info('Leave Scheduler Initialized (Run everyday at 00:00 KST)')
    cron.schedule('0 0 * * *', async () => {
        logger.info('Running Daily Leave Grant Job...')
        try {
            const today = new Date()
            const employees = await Employee.find({ regular: { $ne: '퇴사' } })

            let count = 0
            for (const emp of employees) {
                // 오늘이 입사일 기준으로 연차 발생하는 날인지 체크
                const grantInfo = checkGrantDay(emp.beginDate, today)

                if (grantInfo.isGrantDay) {
                    await LeaveService.grantLeave(emp, grantInfo)
                    count++
                }
            }
            logger.info(`Daily Leave Grant Job Completed. Granted to ${count} employees.`)

            // [New] 어제 날짜 기준 연차 차감 로직 실행
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            logger.info(`Running Daily Leave Deduction Job for ${yesterday.toISOString().split('T')[0]}...`)
            await LeaveService.deductLeave(yesterday)
            logger.info('Daily Leave Deduction Job Completed.')

        } catch (err) {
            logger.error(`Error in Leave Scheduler: ${err.message}`)
        }
    }, {
        timezone: "Asia/Seoul"
    })
}

// 입사일(beginDateStr)과 기준일(targetDate)을 비교하여 연차 발생 여부 판단
const checkGrantDay = (beginDateStr, targetDate) => {
    if (!beginDateStr) return { isGrantDay: false }

    const beginDate = new Date(beginDateStr)
    const targetYear = targetDate.getFullYear()
    const targetMonth = targetDate.getMonth()
    const targetDay = targetDate.getDate()

    const beginYear = beginDate.getFullYear()
    const beginMonth = beginDate.getMonth()
    const beginDay = beginDate.getDate()

    // [New] 말일 처리 로직 추가
    // 예: 1월 31일 입사자의 경우, 2월(28일/29일), 4월(30일) 등 말일이 31일보다 짧은 경우 해당 월의 말일에 부여
    const lastDayofMonth = new Date(targetYear, targetMonth + 1, 0).getDate()

    // 입사일(Day)이 이번 달의 말일보다 크면, 말일(Target)과 비교해야 함
    // 예: beginDay=31, lastDayOfMonth=28 -> expectedDay=28
    const expectedDay = (beginDay > lastDayofMonth) ? lastDayofMonth : beginDay

    if (targetDay !== expectedDay) return { isGrantDay: false }

    // 근속 개월 수 계산
    const diffMonths = (targetYear - beginYear) * 12 + (targetMonth - beginMonth)

    // 1. 1년 미만 월차 (1개월 ~ 11개월 차)
    // 입사일(Day)이 같거나 보정된 날짜여야 함 (위에서 체크됨)
    if (diffMonths >= 1 && diffMonths < 12) {
        return {
            isGrantDay: true,
            type: 'monthly',
            nthYear: 0, // 0년차 (1년 미만)
            months: diffMonths,
            days: 1 // 1일 부여
        }
    }

    // 2. 1년 이상 연차 (12개월, 24개월... = 매년 입사기념일)
    // 정확히 만 N년이 되는 달인지 확인 (diffMonths가 12의 배수)
    // 1/31 입사 -> 2/28 실행 시 diffMonths=1. 한달 채운 것.
    // 1/31 입사 -> 내년 1/31 실행 시 diffMonths=12. 1년 채운 것.
    if (diffMonths >= 12 && diffMonths % 12 === 0) {
        const nthYear = diffMonths / 12
        // 발생 연차 계산: 기본 15일 + (근속연수-1)/2
        let days = 15 + Math.floor((nthYear - 1) / 2)
        if (days > 25) days = 25

        return {
            isGrantDay: true,
            type: 'annual',
            nthYear: nthYear,
            days: days
        }
    }

    return { isGrantDay: false }
}

export default startLeaveScheduler
