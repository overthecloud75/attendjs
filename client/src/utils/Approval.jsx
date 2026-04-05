import axios from 'axios'
import { getToday } from '../utils/DateUtil'
import { APPROVAL_STATUS } from '../configs/domain'

const ERROR_MESSAGES = {
    NO_CHANGE: 'status가 바뀌지 않았습니다.',
    INVALID_CONDITION: '변경할 수 없는 조건입니다.'
}

const updateApprovalStatus = async (url, value, setValue, updateData) => {
    const response = await axios.post(url, value)
    setValue(response.data)
    updateData()
}

export const approvalAttendUpdate = async (user, previousStatus, value, setValue, updateData) => {
    if (previousStatus === value.status) { 
        alert(ERROR_MESSAGES.NO_CHANGE)
        return 
    } 
    if (previousStatus === APPROVAL_STATUS.CANCEL) {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
        return 
    } 
    if (user.isAdmin) {
        if (previousStatus === APPROVAL_STATUS.PENDING || (previousStatus === APPROVAL_STATUS.ACTIVE && value.status === APPROVAL_STATUS.CANCEL)) {
            await updateApprovalStatus('/api/approval/update', value, setValue, updateData)
        } else {
            alert(ERROR_MESSAGES.INVALID_CONDITION)
        }     
    } else if ((previousStatus === APPROVAL_STATUS.PENDING && value.status === APPROVAL_STATUS.CANCEL) ||
        (previousStatus === APPROVAL_STATUS.ACTIVE && value.status === APPROVAL_STATUS.CANCEL && value.start) > getToday()) {
        await updateApprovalStatus('/api/approval/update', value, setValue, updateData)
    } else {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
    }
}

export const approvalPaymentUpdate = async (user, previousStatus, value, setValue, updateData) => {
    if (previousStatus === value.status) { 
        alert(ERROR_MESSAGES.NO_CHANGE)
        return 
    } 
    if (previousStatus === APPROVAL_STATUS.CANCEL) {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
        return 
    }  
    if (user.email === value.approverEmail) {
        if (value.status === APPROVAL_STATUS.CANCEL || (previousStatus === APPROVAL_STATUS.PENDING && value.status === APPROVAL_STATUS.IN_PROGRESS)) {
            await updateApprovalStatus('/api/payment/update', value, setValue, updateData)
        } else {
            alert(ERROR_MESSAGES.INVALID_CONDITION)
        }     
    } else if (user.email === value.consenterEmail) {
        if (value.status === APPROVAL_STATUS.CANCEL || (previousStatus === APPROVAL_STATUS.IN_PROGRESS && value.status === APPROVAL_STATUS.ACTIVE)) {
            await updateApprovalStatus('/api/payment/update', value, setValue, updateData)
        } else {
            alert(ERROR_MESSAGES.INVALID_CONDITION)
        }     
    } else if (previousStatus !== APPROVAL_STATUS.ACTIVE && value.status === APPROVAL_STATUS.CANCEL){
        await updateApprovalStatus('/api/payment/update', value, setValue, updateData)
    } else {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
    }
}