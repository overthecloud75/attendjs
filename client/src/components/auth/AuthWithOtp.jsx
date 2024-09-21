import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Box, CircularProgress } from '@mui/material'
import { requestPasswordWithOtp } from '../../utils/AuthUtil'
import { siteKey } from '../../configs/apiKey'

const Container = styled.div`
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`

const AuthWithOtp = () => {

    const { state } = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [token, setToken] = useState('')
    const turnstileRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        let widgetId = null
        if (!turnstileRef.current) {
            widgetId = window.turnstile.render('#cf-turnstile', {
                sitekey: siteKey,
                callback: function(token) {
                    setToken(token)
                },
            })
            turnstileRef.current = true
        }
        requestPasswordWithOtp('get', '', navigate, setErrorMsg)
        setLoading(false)

        // Cleanup 함수
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
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const email = document.getElementById('email').value
        const otp = document.getElementById('otp').value
        const password = document.getElementById('password').value
        const password2 = document.getElementById('password2').value
        setLoading(true)
        if (password === password2) {
            requestPasswordWithOtp('post', {email, otp, password, token}, navigate, setErrorMsg)
        } else {
            alert('비밀번호가 일치 하지 않습니다.')
        }
        setLoading(false)
    }

    return (
        <Container>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>Reset Password With OTP</span>
                    <form onSubmit={handleSubmit}>
                        <input id='email' type='email' placeholder='email' value={ state?.email || '' }/>
                        <input id='otp' placeholder='otp' />
                        <input id='password' type='password' placeholder='password' />
                        <input id='password2' type='password' placeholder='password' />
                        <div id='cf-turnstile'/>
                        <button disabled={loading}>Reset Password</button>
                        {loading && 
                            <span>
                                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress/>
                                </Box>
                            </span>}
                        {!loading && errorMsg && <span>{errorMsg}</span>}
                    </form>
                </div>
            </div>
        </Container>
    )
}
  
export default AuthWithOtp