import axios from 'axios'

export const postUpload = async (file) => {
    const data = new FormData()
    data.append('file', file)
    try { 
        const res = await axios.post('/api/upload/image', data)
        const resData = res.data
        const err = false
        return {resData, err}
    } catch (err) {
        const resData = []
        return {resData, err}
    }
}

