import { useState } from 'react'
import ChatbotUI from './ChatbotUI'

export const ChatWidget = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen((prev) => !prev)}
                style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: 'none',
                background: '#0d6efd',
                color: 'white',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0px 3px 10px rgba(0,0,0,0.2)',
                zIndex: 9999,
                }}
            >
                💬
            </button>

            {/* 챗봇 UI */}
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 100,
                        right: 20,
                        zIndex: 9999,
                    }}
                >
                    <ChatbotUI />
                </div>
            )}
        </>
    )
}

export default ChatWidget