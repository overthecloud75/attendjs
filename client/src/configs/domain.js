/**
 * Centralized Domain Constants (Frontend)
 * Synchronized with backend api/configs/domain.js
 */

export const APPROVAL_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'InProgress',
    ACTIVE: 'Active',
    CANCEL: 'Cancel'
}

export const EMPLOYEE_STATUS = {
    RETIRED: '퇴사',
    FULL_TIME: '상근',
    PART_TIME: '비상근',
    MILITARY: '병특'
}

export const WORK_MODE = {
    OFFICE: '내근',
    REMOTE: '외근',
    DISPATCHED: '파견'
}

export const ATTENDANCE_STATE = {
    NORMAL: '정상출근',
    LATE: '지각',
    ABSENT: '미출근'
}

export const LEAVE_TYPE = {
    ANNUAL: '휴가',
    HALF: '반차',
    SICK: '병가',
    OTHER: '기타'
}

export const POSITIONS = ['팀원', '파트장', '팀장', '본부장', '대표이사']
