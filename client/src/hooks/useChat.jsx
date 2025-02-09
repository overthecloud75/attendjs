import { useState, useEffect } from 'react'
import { addResponseMessage, deleteMessages } from 'react-chat-widget-react-18'
import { chat } from '../utils/ChatUtil'

export const useChat = () => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        addResponseMessage('Welcome to SmartWork chat!')
    }, [])

    const handleNewUserMessage = async (newMessage) => {

        const loadingMessageId = `loading-${Date.now()}`
        addResponseMessage('Typing... ⏳', loadingMessageId)

        const {data, error} = await chat({messages, newMessage})
        deleteMessages(1, loadingMessageId)
        if (!error) {
            addResponseMessage(data)
            setMessages([...messages, 
                {role: 'user', content: newMessage}, 
                {role: 'assistant', content: data}
            ])
        }
    }

    return { handleNewUserMessage }
}

