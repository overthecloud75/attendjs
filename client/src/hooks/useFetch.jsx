import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { getUser } from '../storage/userSlice'

const useFetch = (page, url, params, clickCount) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                let res = await axios.get(url, {params})
                axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
                for (let data of res.data) {
                    if (data.createdAt) {
                        data.createdAt = format(new Date(data.createdAt), 'yy-MM-dd HH:mm:ss')
                        data.updatedAt = format(new Date(data.updatedAt), 'yy-MM-dd HH:mm:ss')
                    }
                }
                setData(res.data)
            } catch (err) {
                setError(err)
            }
            setLoading(false)
        }
        const user = getUser()
        if (user.isLogin) {
            fetchData()
        }
    // eslint-disable-next-line
    }, [page, url, clickCount])
    return { data, setData, loading, error }
}

export default useFetch