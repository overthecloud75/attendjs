import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
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
                    background: '#4f46e5', // Matches the new ChatbotUI header gradient start
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease, background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {open ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* 챗봇 UI */}
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 90,
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