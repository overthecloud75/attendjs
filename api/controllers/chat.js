//import { createError } from '../utils/error.js'
import axios from 'axios'

export const chatCompletion = async (req, res, next) => {
    try {
        let { messages, newMessage } = req.body
        messages = [...messages, {role: 'user', content: newMessage}]

        const data = {model: process.env.CHATBOT_MODEL, messages, temperature: 0.7}
        const chatResponse = await axios.post(process.env.CHATBOT_BACKEND + '/api/chat/completions',
            data,
            {
                headers: {
                    'Authorization': 'Bearer ' + process.env.CHATBOT_API_KEY,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        )
        const result = chatResponse.data
        res.status(200).send(result['choices'][0]['message']['content'])
    } catch (err) {
        console.log('err', err)
        next(err)
    }
}
