import axios from 'axios'
import { getToday } from '../utils/DateUtil'

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
    if (previousStatus === 'Cancel') {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
        return 
    } 
    if (user.isAdmin) {
        if (previousStatus === 'Pending' || (previousStatus === 'Active' && value.status === 'Cancel')) {
            await updateApprovalStatus('/api/approval/update', value, setValue, updateData)
        } else {
            alert(ERROR_MESSAGES.INVALID_CONDITION)
        }     
    } else if ((previousStatus === 'Pending' && value.status === 'Cancel') ||
        (previousStatus === 'Active' && value.status === 'Cancel' && value.start) > getToday()) {
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
    if (previousStatus === 'Cancel') {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
        return 
    }  
    if (user.email === value.approverEmail) {
        if (value.status === 'Cancel' || (previousStatus ==='Pending' && value.status === 'InProgress')) {
            await updateApprovalStatus('/api/payment/update', value, setValue, updateData)
        } else {
            alert(ERROR_MESSAGES.INVALID_CONDITION)
        }     
    } else if (user.email === value.consenterEmail) {
        if (value.status === 'Cancel' || (previousStatus ==='InProgress' && value.status === 'Active')) {
            await updateApprovalStatus('/api/payment/update', value, setValue, updateData)
        } else {
            alert(ERROR_MESSAGES.INVALID_CONDITION)
        }     
    } else if (previousStatus !=='Active' && value.status === 'Cancel'){
        await updateApprovalStatus('/api/payment/update', value, setValue, updateData)
    } else {
        alert(ERROR_MESSAGES.INVALID_CONDITION)
    }
}