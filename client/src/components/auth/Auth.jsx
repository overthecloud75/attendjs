import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { requestAuth } from '../../utils/AuthUtil'
import { getWindowDimension } from '../../utils/EventUtil'
import { siteKey } from '../../configs/apiKey'

const getLocation = async () => {
    // location 정보 저장
    let error = ''
    let location = {latitude: -1, longitude: -1, accuracy: 1, timestamp: 0}

    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
    if (navigator.geolocation) {
        // Geolocation API 호출
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                err => {error = err} , 
                {enableHighAccuracy: true, maximumAge: 0}
            )}
        )
        const {latitude, longitude, accuracy} = pos.coords
        location = {latitude, longitude, accuracy, timestamp: pos.timestamp}
    } else {
        error = 'Geolocation is not supported.'
    }
    return {location, error}
}

const Auth = ({mode}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [platform, setPlatform] = useState('')
    const [token, setToken] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)

    useEffect(() => {
        const { width, height } = getWindowDimension()
        setWidth(width)
        setHeight(height)
        if (mode==='login' && width) {
            window.turnstile.render('#cf-turnstile', {
                sitekey: siteKey,
                callback: function(token) {
                    setToken(token)
                },
            })
        }
        if (navigator.userAgentData) {setPlatform(navigator.userAgentData.platform)}
        requestAuth(mode, 'get', '', dispatch, navigate, setErrorMsg, setLoading)
    // eslint-disable-next-line
    }, [mode])

    const handleSubmit = async (event) => {
        event.preventDefault()
        let name = ''
        if (document.getElementById('name')) {
            name = document.getElementById('name').value
        }
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        if (!buttonClicked) {
            setButtonClicked((click) => !click)
            if (['Windows'].includes(platform)){
                requestAuth(mode, 'post', {name, email, password, width, height, token, platform}, dispatch, navigate, setErrorMsg, setLoading, '')
            } else {
                try {
                    const loc = await getLocation()
                    const location = loc.location
                    if (loc.error) {
                        setErrorMsg(loc.error)
                    } else {
                        requestAuth(mode, 'post', {name, email, password, width, height, token, platform}, dispatch, navigate, setErrorMsg, setLoading, location)
                    }
                } catch(err) {
                    setErrorMsg(err)
                }
            }
            setButtonClicked((click) => !click)
        }
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>SmartWork</span>
                <span className='title'>{mode}</span>
                <form onSubmit={handleSubmit}>
                    {(mode!=='login')&&(<input id='name' type='text' placeholder='name' />)}
                    <input id='email' type='email' placeholder='email' />
                    <input id='password' type='password' placeholder='password' />
                    {(mode==='login')&&(<div id='cf-turnstile'/>)}
                    <button>{mode==='login'?'Sign in':'Sign up'}</button>
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
    )
}
  
export default Auth