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
            let res = await axios.get(url, {params})
            if (page==='board') {
                for (let board of res.data) {
                    board.createdAt = format(new Date(board.createdAt), "yy-MM-dd HH:mm:ss")
                    board.updatedAt = format(new Date(board.updatedAt), "yy-MM-dd HH:mm:ss")
                }
            }
            setData(res.data)
        } catch (err) {
            setError(err)
        }
        setLoading(false)
        }
        fetchData()
    }, [page, url, clickCount])
    return { data, setData, loading, error }
}

export default useFetch