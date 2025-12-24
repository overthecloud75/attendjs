import { useState, useEffect} from 'react'
import dayjs from 'dayjs'
import { getApproval } from '../utils/EventUtil'

export const useApproval = () => {

    const [value, setValue] = useState({
        approver: '', 
        start: dayjs(new Date()).format('YYYY-MM-DD'), 
        end: dayjs(new Date()).format('YYYY-MM-DD'), 
        reason: '휴가', 
        etc: ''
    })
    const [leftLeave, setLeftLeave] = useState('')
    const [leftStatus, setLeftStatus] = useState('')
    
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await getApproval()
            if (!error) {
                const summary = data.summary 
                setValue(prev => ({...prev, approver: `${data.approver.name}/${data.approver.position}/${data.approver.department}`}))
                setLeftLeave(`${summary.leftAnnualLeave}`)
                setLeftStatus(`미출근 ${summary['미출근']}, 지각 ${summary['지각']}, 휴가 ${summary['휴가'] + summary['반차'] * 0.5}`)
            }
        }
        fetchData()
    }, [])

    return { value, setValue, leftLeave, leftStatus }
}
