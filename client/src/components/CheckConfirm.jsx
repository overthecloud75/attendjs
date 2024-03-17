import { useState, useEffect } from 'react'
import axios from 'axios'

const CheckConfirm = ({url}) => {

    const [data, setData] = useState([])
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await axios.get(url)
                axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
                setData(res.data)
            } catch (err) {
                setError(err)
            }
        }
        fetchData()
    // eslint-disable-next-line
    }, [url])

    return (
        <dir>
            {!error?data.email + ' is activated':error.response.data.status}
        </dir>
    )
}

export default CheckConfirm