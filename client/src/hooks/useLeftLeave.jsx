import { useState, useEffect} from 'react'
import { getApproval, getLeftLeave } from '../utils/EventUtil'

export const useLeftLeave = () => {

    const [leftLeave, setLeftLeave] = useState({})
    
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await getLeftLeave ()
            if (!error) {
                setLeftLeave(data)
            }
        }
        fetchData()
    }, [])

    return { leftLeave }
}
