import axios from 'axios'
import { getToday } from '../utils/DateUtil'
import { getUser } from '../storage/userSlice'

export const approvalAttendUpdate = async (previousStatus, value, setValue, updateData) => {
    const url = '/api/approval/update'
    const user = getUser()
    if (previousStatus === value.status) { 
        alert('status가 바뀌지 않았습니다.')
    } else if (previousStatus === 'Cancel') {
        alert('변경할 수 없는 조건입니다.')
    } else if (user.isAdmin) {
        if (previousStatus === 'Pending' || (previousStatus === 'Active' && value.status === 'Cancel')) {
            const res = await axios.post(url, value)
            setValue(res.data)
            updateData()
        } else {
            alert('변경할 수 없는 조건입니다.')
        }     
    } else if ((previousStatus === 'Pending' && value.status === 'Cancel') ||
        (previousStatus === 'Active' && value.status === 'Cancel' && value.start) > getToday()) {
        const res = await axios.post(url, value)
        setValue(res.data)
        updateData()
    } else {
        alert('변경할 수 없는 조건입니다.')
    }
}

export const approvalPaymentUpdate = async (previousStatus, value, setValue, updateData) => {
    const url = '/api/payment/update'
    const user = getUser()
    if (previousStatus === value.status) { 
        alert('status가 바뀌지 않았습니다.')
    } else if (previousStatus === 'Cancel') {
        alert('변경할 수 없는 조건입니다.')
    } else if (user.email === value.approverEmail) {
        if (value.status === 'Cancel' || (previousStatus ==='Pending' && value.status === 'InProgress')) {
            const res = await axios.post(url, value)
            setValue(res.data)
            updateData()
        } else {
            alert('변경할 수 없는 조건입니다.')
        }     
    } else if (user.email === value.consenterEmail) {
        if (value.status === 'Cancel' || (previousStatus ==='InProgress' && value.status === 'Active')) {
            const res = await axios.post(url, value)
            setValue(res.data)
            updateData()
        } else {
            alert('변경할 수 없는 조건입니다.')
        }     
    } else if (previousStatus !=='Active' && value.status === 'Cancel'){
            const res = await axios.post(url, value)
            setValue(res.data)
            updateData()
    } else {
        alert('변경할 수 없는 조건입니다.')
    }
}