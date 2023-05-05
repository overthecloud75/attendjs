import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

const useFetch = (page, url, params, clickCount) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true)
        try {
            let res = await axios.get(url, {params, headers: {'Cache-Control': 'no-cache'}})
            axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
            if (page==='board' || page==='approvalhistory') {
                for (let data of res.data) {
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
        fetchData()
    // eslint-disable-next-line
    }, [page, url, clickCount])
    return { data, setData, loading, error }
}

export default useFetch