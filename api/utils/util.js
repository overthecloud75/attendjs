export const getToday = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + today.getDate()).slice(-2)
    const dateStr = year + '-' + month  + '-' + day
    return dateStr 
}

export const getNextDay = (dateStr) => {
    let [year, month, day] = dateStr.split('-').map(Number)
    const newDate = new Date(year, month - 1, day)
    const nextDate = new Date(newDate.getTime() + (24 * 60 * 60 * 1000))

    year = nextDate.getFullYear()
    month = String(nextDate.getMonth() + 1).padStart(2, '0')
    day = String(nextDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

export const getNextYear = (dateStr) => {
    let [year, month, day] = dateStr.split('-').map(Number)
    const newDate = new Date(year, month - 1, day)
    const nextDate = new Date(newDate.getTime() + (24 * 60 * 60 * 1000))

    year = nextDate.getFullYear() + 1
    month = String(nextDate.getMonth() + 1).padStart(2, '0')
    day = String(nextDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

export const getYearMonth = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    return { year, month }
}

const getSeparateDay = () => {
    const today = new Date()
    const thisYear = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + today.getDate()).slice(-2)
    const monthDay = month + '-' + day
    //const dateStr = year + '-' + month  + '-' + day
    return {thisYear, monthDay}
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
    const {thisYear, monthDay} = getSeparateDay()
    const thisMonth = Number(monthDay.split('-')[0])
    let baseYear = thisYear

    const beginDateSplit = beginDate.split('-')
    const beginYear = Number(beginDateSplit[0])
    const beginMonthDay = beginDateSplit[1] + '-' + beginDateSplit[2]
    const beginMonth = Number(beginDateSplit[1])

    let baseMonth = 0 
    if (thisMonth > beginMonth) {baseMonth = thisMonth - beginMonth}
    else if (thisMonth < beginMonth) {baseMonth = 12 + thisMonth - beginMonth}
    // 근무 기간이 1년이 안 된 경우 정교한 계산 필요 
    else if ((thisYear - beginYear) === 1 && monthDay < beginMonthDay) {baseMonth = 12}

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
    const baseDate = String(baseYear) + '-' + beginMonthDay
    return {employeementPeriod, baseDate, baseMonth}
}

export const getDefaultAnnualLeave = (beginDate) => {
    const {employeementPeriod, baseDate, baseMonth} = getEmployeementPeriod(beginDate)
    let defaultAnnualLeave = 15
    if (employeementPeriod == 0) {
        defaultAnnualLeave = baseMonth
    } else if (employeementPeriod > 1 ) {
        defaultAnnualLeave = defaultAnnualLeave + parseInt(employeementPeriod / 2)
        if (employeementPeriod % 2 == 0) {defaultAnnualLeave = defaultAnnualLeave - 1}
    }
    if (defaultAnnualLeave > 25) {defaultAnnualLeave = 25}
    return {defaultAnnualLeave, baseDate, baseMonth} 
}

export const separateIP = (x_forwarded_for) => {
    const ipList = x_forwarded_for.split(',')
    if (ipList.length > 1) {
        const externalIP = ipList[0].split(':')[0]
        const internalIP = ipList[1]
        return {externalIP, internalIP}
    } else {
        const externalIP = ipList[0]
        const internalIP = ipList[0]
        return {externalIP, internalIP}
    }
}

export const getClientIP = (req) => {
    if ('x-forwarded-for' in req.headers) 
        {return req.headers['x-forwarded-for'].split(',')[0].split(':')[0]}
    else {
        return req.connection.remoteAddress
    }
}

export const sanitizeData = (data, type) => {
    let regex 
    if (data) {
        if (type === 'date') {
            regex = /^\d{4}-\d{2}-\d{2}$/
            if (data.match(regex) === null) {
                return getToday()
            }
        } else if (type === 'email') {
            regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            if (data.match(regex) === null) {
                return ''
            }
        } else if (type === 'mobile') {
            const digits = data.replace('-', '');
            console.log('data', data, digits, type)
            // 한국 휴대폰 번호 (10~11자리) 검사
            if (!/^01[016789]\d{7,8}$/.test(digits)) {
                return '' // 유효하지 않은 번호
            } // 10자리 (예: 011-234-5678) 또는 11자리 (예: 010-1234-5678) 처리
            if (digits.length === 10) {
                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            } else {
                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            }
        }
    } else if (type ==='date') {
        return getToday()
    } else if (type === 'email') {
        return ''
    } else if (type === 'mobile') {
        return ''
    }
    return data 
}

