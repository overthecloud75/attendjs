import axios from 'axios'

export const chat = async (data) => {
    try { 
        const response = await axios.post('/api/chat/completion', data)
        const resData = response.data
        const error = false
        return {data: resData, error}
    } catch (error) {
        const resData = {assistant: ''}
        return {data: resData, error}
    }
}
