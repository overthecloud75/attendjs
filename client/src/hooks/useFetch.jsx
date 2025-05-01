import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { format } from 'date-fns'
import { getUser } from '../storage/userSlice'

const useFetch = (page, url, params, clickCount) => {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const formatDates = (item) => {
        if (item.createdAt) {
            return {
                ...item,
                createdAt: format(new Date(item.createdAt), 'yy-MM-dd HH:mm:ss'),
                updatedAt: format(new Date(item.updatedAt), 'yy-MM-dd HH:mm:ss')
            }
        }
        return item
    }

    const handleError = (error) => {
        const errorStatus = error.response?.status
        switch (errorStatus) {
            case 401:
                sessionStorage.removeItem('user')
                navigate('/auth/login')
                break
            case 429:
                navigate('/too-many-requests')
                break
            default:
                console.error('API 요청 중 에러 발생:', error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(url, {params})
                axios.defaults.headers.post['X-CSRF-Token'] = response.headers.csrftoken
                const formattedData = response.data.map(formatDates)
                setData(formattedData)
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }
        const user = getUser()
        if (user.isLogin) {
            fetchData()
        }
    // eslint-disable-next-line
    }, [page, url, clickCount])
    return { data, setData, loading }
}

export default useFetch