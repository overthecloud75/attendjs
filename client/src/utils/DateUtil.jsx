import dayjs from 'dayjs'

/**
 * 표준 날짜/시간 포맷팅 유틸리티
 * @param {Date|string} dateInput - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param {string} formatStr - 원하는 포맷 (기본값: yy. MM. dd. HH:mm:ss)
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDateTime = (dateInput, formatStr = 'yy. MM. dd. HH:mm:ss') => {
    if (!dateInput) return '-'
    return dayjs(dateInput).format(formatStr)
}

/**
 * YYYY-MM-DD 형식의 오늘 날짜 반환
 */
export const getToday = () => {
    return dayjs().format('YYYY-MM-DD')
}

/**
 * 로컬 시간대 기준 포맷팅 (ISO 문자열 대응)
 */
export const formatLocalTime = (dateInput) => {
    if (!dateInput) return '-'
    return dayjs(dateInput).format('yy-MM-dd HH:mm:ss')
}