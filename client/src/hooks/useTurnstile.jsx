import { useEffect, useRef, useState } from 'react'
import { siteKey } from '../configs/apiKey'

const waitForTurnstileLoad = (callback) => {
    const check = () => {
        if (window.turnstile) {
            callback()
        } else {
            setTimeout(check, 100)
        }
    }
    check()
}

export const useTurnstile = (mode) => {
    const [token, setToken] = useState('')
    const turnstileRef = useRef(null)

    useEffect(() => {
        let widgetId = null
        
        if (mode==='login' && !turnstileRef.current) {
            waitForTurnstileLoad(() => {
                widgetId = window.turnstile.render('#cf-turnstile', {
                    sitekey: siteKey,
                    theme: 'light',
                    callback: (token) => setToken(token),
                })
            turnstileRef.current = true
            })
        }

        return () => {
            if (widgetId) {
                window.turnstile.remove(widgetId)
            }
            const turnstileElement = document.getElementById('cf-turnstile')
            if (turnstileElement) {
                turnstileElement.innerHTML = ''
            }
            turnstileRef.current = false
        }
    }, [mode])

    return { token }
}