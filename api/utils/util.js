import { formatToTimeZone } from 'date-fns-timezone'

/**
 * ------------------------------------------------------------------
 * DateUtil (Unified Date Management Interface)
 * 리포지토리 전체에서 날짜 처리를 표준화하기 위한 객체입니다.
 * ------------------------------------------------------------------
 */
export const DateUtil = {
    // 날짜 객체 또는 문자열(YYYY-MM-DD)을 Date 객체로 표준화하여 파싱
    parse(input) {
        if (!input) return new Date()
        if (input instanceof Date) return new Date(input)
        if (typeof input === 'string' && input.includes('-')) {
            const [year, month, day] = input.split('-').map(Number)
            // month-1: JS Date는 월이 0부터 시작
            return new Date(year, month - 1, day)
        }
        return new Date(input)
    },

    // Date 객체를 YYYY-MM-DD 문자열로 변환
    format(date) {
        const d = this.parse(date)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    },

    // 오늘 날짜를 YYYY-MM-DD 문자열로 반환
    today() {
        return this.format(new Date())
    },

    // 내일 날짜를 YYYY-MM-DD 문자열로 반환
    tomorrow() {
        return this.format(this.addDays(this.today(), 1))
    },

    // 지정일의 다음 날을 YYYY-MM-DD 문자열로 반환
    formatNextDay(dateStr) {
        return this.format(this.addDays(dateStr, 1))
    },

    // 날짜 계산: 일 단위 (Date 객체 반환)
    addDays(date, amount) {
        const d = this.parse(date)
        d.setDate(d.getDate() + amount)
        return d
    },

    // 날짜 계산: 연 단위 (Date 객체 반환)
    addYears(date, amount) {
        const d = this.parse(date)
        d.setFullYear(d.getFullYear() + amount)
        return d
    },

    // 현재 연도와 월 추출 (문자열 객체 반환)
    getYearMonth() {
        const now = new Date()
        return {
            year: now.getFullYear(),
            month: String(now.getMonth() + 1).padStart(2, '0')
        }
    },

    // 내부 계산용: 현재 연도와 월-일 추출
    _getSeparateDay() {
        const now = new Date()
        return {
            thisYear: now.getFullYear(),
            monthDay: `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        }
    }
}

/**
 * ------------------------------------------------------------------
 * Business Calculation Utilities (Can be moved to services eventually)
 * ------------------------------------------------------------------
 */

const getEmployeementPeriod = (beginDate) => {
    const { thisYear, monthDay } = DateUtil._getSeparateDay()
    const thisMonth = Number(monthDay.split('-')[0])
    let baseYear = thisYear

    const [beginYear, beginMonth, beginDay] = beginDate.split('-').map(Number)
    const beginMonthDay = `${String(beginMonth).padStart(2, '0')}-${String(beginDay).padStart(2, '0')}`

    let baseMonth = 0
    if (thisMonth > beginMonth) { baseMonth = thisMonth - beginMonth }
    else if (thisMonth < beginMonth) { baseMonth = 12 + thisMonth - beginMonth }
    else if ((thisYear - beginYear) === 1 && monthDay < beginMonthDay) { baseMonth = 12 }
    else if ((thisYear - beginYear) > 1 && monthDay < beginMonthDay) { baseMonth = 11 }

    let employeementPeriod = 0
    if (beginYear < thisYear) {
        baseYear = thisYear - 1
        employeementPeriod = thisYear - beginYear
        if (monthDay < beginMonthDay) {
            employeementPeriod = employeementPeriod - 1
        } else {
            baseYear = baseYear + 1
        }
    }
    const baseDate = `${baseYear}-${beginMonthDay}`
    return { employeementPeriod, baseDate, baseMonth }
}

export const getDefaultAnnualLeave = (beginDate) => {
    const { employeementPeriod, baseDate, baseMonth } = getEmployeementPeriod(beginDate)
    let defaultAnnualLeave = 15
    if (employeementPeriod == 0) {
        defaultAnnualLeave = baseMonth
    } else if (employeementPeriod > 1) {
        defaultAnnualLeave = defaultAnnualLeave + parseInt(employeementPeriod / 2)
        if (employeementPeriod % 2 == 0) { defaultAnnualLeave = defaultAnnualLeave - 1 }
    }
    if (defaultAnnualLeave > 25) { defaultAnnualLeave = 25 }
    return { defaultAnnualLeave, employeementPeriod, baseDate, baseMonth }
}

/**
 * ------------------------------------------------------------------
 * Network & Security Utilities
 * ------------------------------------------------------------------
 */

export const separateIP = (x_forwarded_for) => {
    const ipList = x_forwarded_for.split(',')
    if (ipList.length > 1) {
        const externalIP = ipList[0].split(':')[0]
        const internalIP = ipList[1]
        return { externalIP, internalIP }
    } else {
        const externalIP = ipList[0]
        const internalIP = ipList[0]
        return { externalIP, internalIP }
    }
}

export const getClientIP = (req) => {
    if ('x-forwarded-for' in req.headers) {
        return req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
    }
    return req.connection.remoteAddress
}

/**
 * ------------------------------------------------------------------
 * Data Sanitization & General Utilities
 * ------------------------------------------------------------------
 */

export const sanitizeData = (data, type) => {
    if (!data) {
        if (type === 'date') return DateUtil.today()
        return ''
    }

    switch (type) {
        case 'date': {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            return dateRegex.test(data) ? data : DateUtil.today()
        }
        case 'email': {
            const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
            return emailRegex.test(data) ? data : ''
        }
        case 'mobile': {
            const digits = String(data).replace(/-/g, '')
            const mobileRegex = /^01[016789]\d{7,8}$/

            if (!mobileRegex.test(digits)) return ''

            if (digits.length === 10) {
                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            }
            return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        }
        default:
            return data
    }
}

export const dateAndTime = () => {
    const now = new Date()
    const output = formatToTimeZone(now, 'YYYY-MM-DD HHmmss', { timeZone: process.env.TIME_ZONE })
    const [date, time] = output.split(' ')
    return { date, time }
}

export const getRandomInt = (min = 1, max = 1000) => {
    const cMin = Math.ceil(min)
    const cMax = Math.floor(max)
    return Math.floor(Math.random() * (cMax - cMin)) + cMin
}
