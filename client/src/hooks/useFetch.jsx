import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { formatLocalTime } from '../utils/DateUtil'
import { useAuth } from './useAuth'

const useFetch = (page, url, params, clickCount) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const formatDates = (item) => {
        if (item.createdAt) {
            return {
                ...item,
                createdAt: formatLocalTime(item.createdAt),
                updatedAt: formatLocalTime(item.updatedAt)
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
                const response = await axios.get(url, { params })
                
                // CSRF Token synchronization
                const csrfTokenFromHeader = response.headers.csrftoken
                if (csrfTokenFromHeader) {
                    axios.defaults.headers.post['X-CSRF-Token'] = csrfTokenFromHeader
                }

                // Handle both straight arrays and wrapped objects { history: [], data: [], posts: [], etc }
                let rawData = response.data
                if (!Array.isArray(rawData)) {
                    // Try to extract common array fields if the response is an object
                    rawData = rawData.history || rawData.data || rawData.items || rawData.posts || []
                    if (!Array.isArray(rawData)) {
                        console.warn(`[useFetch] Expected array from ${url} but got:`, response.data)
                        rawData = []
                    }
                }

                const formattedData = rawData.map(formatDates)
                setData(formattedData)
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }
        if (user.isLogin) {
            fetchData()
        }
        // eslint-disable-next-line
    }, [page, url, clickCount])
    return { data, setData, loading }
}

export default useFetch