import React, { useState, useRef, useEffect } from 'react'
import { chat } from '../../utils/ChatUtil'
import './ChatbotUI.css'

export const ChatbotUI = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: '안녕하세요! 무엇을 도와드릴까요?',
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        }

        // Add user message to UI immediately
        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            // Prepare history for the backend (excluding the current new message)
            // Note: 'messages' here refers to the state before the update above is reflected in this closure
            const history = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }))

            const { data, error } = await chat({
                messages: history,
                newMessage: userMessage.text
            })

            if (!error && data && typeof data === 'string') {
                const botMessage = {
                    id: Date.now() + 1,
                    text: data,
                    sender: 'bot',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, botMessage])
            } else {
                throw new Error(typeof error === 'string' ? error : 'Response error')
            }
        } catch (err) {
            const errorMessage = {
                id: Date.now() + 1,
                text: '죄송해요! 서버와 통신 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
                sender: 'bot',
                isError: true,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    return (
        <div className="chatbot-wrapper">
            <div className="chatbot-header">
                <div className="chatbot-header-avatar">🤖</div>
                <div className="chatbot-header-title">SmartWork Chat</div>
            </div>

            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.sender === 'bot' && (
                            <div className="message-avatar">AI</div>
                        )}
                        <div className="message-content">
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot">
                        <div className="message-avatar">AI</div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
                <input
                    className="chatbot-input"
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button
                    className="chatbot-send-btn"
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    aria-label="Send"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ChatbotUI