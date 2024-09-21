import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { requestAuth } from '../../utils/AuthUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { useLocation } from '../../hooks/useLocation'
import { siteKey } from '../../configs/apiKey'

const Container = styled.div`
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`

const Auth = ({mode}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const { getLocation } = useLocation()
    const { width, height } = useWindowDimension()
    const [token, setToken] = useState('')
    const turnstileRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        let widgetId = null
        if (mode==='login' && !turnstileRef.current) {
            widgetId = window.turnstile.render('#cf-turnstile', {
                sitekey: siteKey,
                callback: function(token) {
                    setToken(token)
                }
            })
            turnstileRef.current = true
        }
        requestAuth(mode, 'get', '', dispatch, navigate, setErrorMsg)
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
    }, [mode])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const name = document.getElementById('name')?.value || ''
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const platform = navigator.userAgentData?.platform || ''
        setLoading(true)
        if (['Windows'].includes(platform)){
            requestAuth(mode, 'post', {name, email, password, width, height, token, platform}, dispatch, navigate, setErrorMsg, '')
        } else {
            try {
                const loc = await getLocation()
                const location = loc.location
                if (loc.error) {
                    setErrorMsg(loc.error)
                } else {
                    requestAuth(mode, 'post', {name, email, password, width, height, token, platform}, dispatch, navigate, setErrorMsg, location)
                }
            } catch(err) {
                setErrorMsg(err)
            }
        }
        setLoading(false)
    }

    return (
        <Container>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>{mode}</span>
                    <form onSubmit={handleSubmit}>
                        {(mode!=='login')&&(<input id='name' type='text' placeholder='name' />)}
                        <input id='email' type='email' placeholder='email' />
                        <input id='password' type='password' placeholder='password' />
                        {(mode === 'login') && (<div id='cf-turnstile' />)}
                        <button disabled={loading}>{mode==='login'?'Sign in':'Sign up'}</button>
                        {loading && 
                            <span>
                                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <CircularProgress/>
                                </Box>
                            </span>}
                        {!loading && errorMsg && <span>{errorMsg}</span>}
                    </form>
                    {mode==='login'?
                        (<p>You don't have an account? <Link to='/auth/register'>Register</Link></p>):
                        (<p>You do have an account? <Link to='/auth/login'>Login</Link></p>)
                    }
                    <p>You don't remember the password? <Link to='/auth/lost-password'>Lost Password</Link></p>
                </div>
            </div>
        </Container>
    )
}
  
export default Auth