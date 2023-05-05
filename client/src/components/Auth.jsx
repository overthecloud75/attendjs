import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { requestAuth } from '../utils/AuthUtil'
import { getWindowDimension } from '../utils/EventUtil'

const getLocation = async () => {
    // location 정보 저장
    let error = ''
    let location = {latitude: -1, longitude: -1, accuracy: 1, timestamp: 0}
    const {geolocation} = navigator

    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
    if (!geolocation) {
        error = 'Geolocation is not supported.'
    } else {
        // Geolocation API 호출
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error), 
                {enableHighAccuracy: true, maximumAge: 0}
            )}
        )
        const {latitude, longitude, accuracy} = pos.coords
        location = {latitude, longitude, accuracy, timestamp: pos.timestamp}
    }
    return {location, error}
}

const sleep = (ms) => {
    const wakeUpTime = Date.now() + ms
    while (Date.now() < wakeUpTime) {}
}

const Auth = ({mode}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [value, setValue] = useState(
        {
            name: '',
            email: '',
            password: '',
            width: 0, 
            height: 0,
            platform: ''
        }
    )
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [platform, setPlatform] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)

    useEffect(() => {
        const {width, height} = getWindowDimension()
        if (navigator.userAgentData) {setPlatform(navigator.userAgentData.platform)}
        setValue({...value, width, height, platform})
        requestAuth(mode, 'get', '', dispatch, navigate, setErrorMsg, setLoading)
    // eslint-disable-next-line
    }, [mode, platform])

    const handleChange = (event) => {
        setValue({...value, [event.target.id]: event.target.value})    
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!buttonClicked) {
            setButtonClicked((click) => !click)
            let locations = []
            if (['Windows'].includes(platform)){
                requestAuth(mode, 'post', value, dispatch, navigate, setErrorMsg, setLoading, locations)
            } else {
                try {
                    let loc0 = await getLocation()
                    locations.push(loc0.location)
                    if (loc0.error) {
                        setErrorMsg(loc0.error)
                    } else {
                        sleep(1000)
                        let loc1 = await getLocation()
                        locations.push(loc1.location)
                        if (loc1.error) {
                            setErrorMsg(loc1.error)
                        } else {
                            requestAuth(mode, 'post', value, dispatch, navigate, setErrorMsg, setLoading, locations)
                        }
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
                    {(mode!=='login')&&(<input id='name' type='text' placeholder='name' onChange={handleChange}/>)}
                    <input id='email' type='email' placeholder='email' onChange={handleChange}/>
                    <input id='password' type='password' placeholder='password' onChange={handleChange}/>
                    <button>{mode==='login'?'Sign in':'Sign up'}</button>
                    {loading && 
                        <span>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress/>
                            </Box>
                        </span>}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
                {mode==='login'?
                    (<p>You don't have an account? <Link to='/register'>Register</Link></p>):
                    (<p>You do have an account? <Link to='/login'>Login</Link></p>)
                }
            </div>
        </div>
    )
  }
  
  export default Auth