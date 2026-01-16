import { formatToTimeZone } from 'date-fns-timezone'

export const getToday = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

export const getNextDay = (dateStr) => {
    let [year, month, day] = dateStr.split('-').map(Number)
    const newDate = new Date(year, month - 1, day)
    const nextDate = new Date(newDate.getTime() + (24 * 60 * 60 * 1000))

    year = nextDate.getFullYear()
    month = String(nextDate.getMonth() + 1).padStart(2, '0')
    day = String(nextDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const getNextYear = (dateStr) => {
    let [year, month, day] = dateStr.split('-').map(Number)
    const newDate = new Date(year, month - 1, day)
    const nextDate = new Date(newDate.getTime() + (24 * 60 * 60 * 1000))

    year = nextDate.getFullYear() + 1
    month = String(nextDate.getMonth() + 1).padStart(2, '0')
    day = String(nextDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const getYearMonth = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    return { year, month }
}

const getSeparateDay = () => {
    const today = new Date()
    const thisYear = today.getFullYear()
    const month = `0${today.getMonth() + 1}`.slice(-2)
    const day = `0${today.getDate()}`.slice(-2)
    const monthDay = `${month}-${day}`
    return { thisYear, monthDay }
}

export const getDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
}

export const getNextDate = (dateStr) => {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + 1)
    return date
}

const getEmployeementPeriod = (beginDate) => {
    const { thisYear, monthDay } = getSeparateDay()
    const thisMonth = Number(monthDay.split('-')[0])
    let baseYear = thisYear

    const beginDateSplit = beginDate.split('-')
    const beginYear = Number(beginDateSplit[0])
    const beginMonthDay = `${beginDateSplit[1]}-${beginDateSplit[2]}`
    const beginMonth = Number(beginDateSplit[1])

    let baseMonth = 0
    if (thisMonth > beginMonth) { baseMonth = thisMonth - beginMonth }
    else if (thisMonth < beginMonth) { baseMonth = 12 + thisMonth - beginMonth }
    // 근무 기간이 1년이 안 된 경우 정교한 계산 필요 
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
    if ('x-forwarded-for' in req.headers) { return req.headers['x-forwarded-for'].split(',')[0].split(':')[0] }
    else {
        return req.connection.remoteAddress
    }
}

export const sanitizeData = (data, type) => {
    // Handle empty or null data immediately
    if (!data) {
        if (type === 'date') return getToday()
        return ''
    }

    switch (type) {
        case 'date': {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            return dateRegex.test(data) ? data : getToday()
        }
        case 'email': {
            const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
            return emailRegex.test(data) ? data : ''
        }
        case 'mobile': {
            // Remove dashes to just check digits
            const digits = String(data).replace(/-/g, '')

            // Basic validation for Korean mobile numbers (starts with 01, followed by 0,1,6,7,8,9, and total length 10 or 11)
            const mobileRegex = /^01[016789]\d{7,8}$/

            if (!mobileRegex.test(digits)) {
                return ''
            }

            // Format: 010-1234-5678 or 011-123-4567
            if (digits.length === 10) {
                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            } else {
                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            }
        }
        default:
            return data
    }
}

export const dateAndTime = () => {
    const dateTime = new Date()
    const output = formatToTimeZone(dateTime, 'YYYY-MM-DD HHmmss', { timeZone: process.env.TIME_ZONE })
    const date = output.split(' ')[0]
    const time = output.split(' ')[1]
    return { date, time }
}

export const getRandomInt = (min = 1, max = 1000) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //최댓값은 제외, 최솟값은 포함
}
