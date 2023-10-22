import axios from 'axios'
import { getToday } from '../utils/DateUtil'

export const approvalUpdate = async (user, url, previousStatus, value, setValue, updateData, navigate) => {
    if (previousStatus === value.status) { 
        alert('status가 바뀌지 않았습니다.')
        navigate('/approvalhistory')
    } else if (user.isAdmin) {
        if (previousStatus === 'Pending' || (previousStatus === 'Active' && value.status === 'Cancel')) {
            const res = await axios.post(url, value)
            setValue(res.data)
            updateData()
        } else {
            alert('변경할 수 없는 조건입니다.')
            navigate('/approvalhistory')
        }     
    } else if ((previousStatus === 'Pending' && value.status === 'Cancel') ||
        (previousStatus === 'Active' && value.status === 'Cancel' && value.start) > getToday()) {
        const res = await axios.post(url, value)
        setValue(res.data)
        updateData()
    } else {
        alert('변경할 수 없는 조건입니다.')
        navigate('/approvalhistory')
    }
}