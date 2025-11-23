import Chatbot from 'react-chatbot-kit'
import { createChatBotMessage } from 'react-chatbot-kit'
import './ChatbotUI.css'
import { chat } from '../../utils/ChatUtil'

const CHAT_CONFIG = {
    botName: 'SmartWork Chat',
    initialMessages: [
        createChatBotMessage('안녕하세요! 무엇을 도와드릴까요?')
    ],
    customStyles: {
        botMessageBox: {
            backgroundColor: '#0D6EFD',
        },
        chatButton: {
            backgroundColor: '#0D6EFD',
        },
    },
}

class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider
    }
    parse(message) {
        this.actionProvider.askLLM(message)
    }
}

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage
        this.setState = setStateFunc
    }

    async askLLM(newMessage) {
        try {
            const messages = []
            const {data, error} = await chat({messages, newMessage})
            const botMessage = error
            ? this.createChatBotMessage('죄송해요! 서버와 통신 중 오류가 발생했어요.')
            : this.createChatBotMessage(data)
            this.addMessage(botMessage)
        } catch (error) {
            const errorMessage = this.createChatBotMessage(
                '죄송해요! 서버와 통신 중 오류가 발생했어요.'
            )
        this.addMessage(errorMessage)
        }
    }

    addMessage(message) {
        this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, message],
        }))
    }
}

export const ChatbotUI = () => {
    return (
        <div style={{
            width: 350,
            height: 600,
            background: '#fff',
            borderRadius: '5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden'
        }}>
            <Chatbot
                config={CHAT_CONFIG}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
            />
        </div>
    )
}

export default ChatbotUI