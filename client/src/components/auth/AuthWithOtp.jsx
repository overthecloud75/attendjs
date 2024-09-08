import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { requestPasswordWithOtp } from '../../utils/AuthUtil'
import { siteKey } from '../../configs/apiKey'

const AuthWithOtp = () => {

    const { state } = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [token, setToken] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)

    useEffect(() => {
        window.turnstile.render('#cf-turnstile', {
            sitekey: siteKey,
            callback: function(token) {
                setToken(token)
            },
        })
        requestPasswordWithOtp('get', '', navigate, setErrorMsg, setLoading)
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const email = document.getElementById('email').value
        const otp = document.getElementById('otp').value
        const password = document.getElementById('password').value
        const password2 = document.getElementById('password2').value
        if (!buttonClicked) {
            setButtonClicked((click) => !click)
            if (password === password2) {
                requestPasswordWithOtp('post', {email, otp, password, token}, navigate, setErrorMsg, setLoading)
            } else {
                alert('비밀번호가 일치 하지 않습니다.')
            }
            setButtonClicked((click) => !click)
        }
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>SmartWork</span>
                <span className='title'>Reset Password With OTP</span>
                <form onSubmit={handleSubmit}>
                    <input id='email' type='email' placeholder='email' value={ state.email }/>
                    <input id='otp' placeholder='otp' />
                    <input id='password' type='password' placeholder='password' />
                    <input id='password2' type='password' placeholder='password' />
                    <div id='cf-turnstile'/>
                    <button>Reset Password</button>
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
    )
}
  
export default AuthWithOtp