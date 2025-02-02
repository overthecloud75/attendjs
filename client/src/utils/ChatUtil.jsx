import axios from 'axios'

export const chat = async (data) => {
    try { 
        const res = await axios.post('/api/chat/completion', data)
        const resData = res.data
        const err = false
        return {resData, err}
    } catch (err) {
        const resData = {assistant: ''}
        return {resData, err}
    }
}
