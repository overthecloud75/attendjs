import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import { requestAuth } from '../utils/AuthUtil'

const useCurrentLocation = (options = {}) => {
    const [time, setTime] = useState(Date.now())
    // location 정보 저장
    const [location, setLocation] = useState({latitude: -1, longitude: -1})
    const [encryptedLocation, setEncryptedLocation] = useState({latitude: -1, longitude: -1})
    // 에러 메세지 저장
    const [error, setError] = useState('')

    // Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
    const handleSuccess = (pos) => {
        const { latitude, longitude } = pos.coords
        const encryptedLatitude = makeHash(latitude, time)
        const encryptedLongitude = makeHash(longitude, time)
        setLocation({ latitude, longitude})
        setEncryptedLocation({
            latitude: encryptedLatitude,
            longitude: encryptedLongitude,
        })
    };
  
    // Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
    const handleError = (error) => {
        setError(error.message)
    };
  
    useEffect(() => {
        const { geolocation } = navigator
    
        // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
        if (!geolocation) {
            setError('Geolocation is not supported.')
            return
        }
  
        // Geolocation API 호출
        geolocation.getCurrentPosition(handleSuccess, handleError, options)
        // eslint-disable-next-line
    }, [])
    return { location, encryptedLocation, time, error }
}

const makeHash = (data, time) => {
    const encrypted = CryptoJS.AES.encrypt(data.toString(), time.toString()).toString()
    return encrypted
}

const Auth = ({mode}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [value, setValue] = useState(
        {
            name: '',
            email: '',
            password: '',
            location: {latitude: -1, longitude: -1},
            hash: ''
        }
    )
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // check gps location 
    const { location, encryptedLocation, time, error} = useCurrentLocation()

    useEffect(() => {
        requestAuth(mode, 'get', '', dispatch, navigate, setErrorMsg, setLoading)
    // eslint-disable-next-line
    }, [mode])

    const handleChange = (event) => {
        setValue({...value, [event.target.id]: event.target.value, location, encryptedLocation, hash: time})    
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (error) {
            setErrorMsg(error)
        } else {
            requestAuth(mode, 'post', value, dispatch, navigate, setErrorMsg, setLoading)
        }
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>SmartWork</span>
                <span className='title'>{mode}</span>
                <form onSubmit={handleSubmit}>
                    {!(mode==='login')&&(<input id='name' type='text' placeholder='name' onChange={handleChange}/>)}
                    <input id='email' type='email' placeholder='email' onChange={handleChange}/>
                    <input id='password' type='password' placeholder='password' onChange={handleChange}/>
                    <button>{mode==='login'?'Sign in':'Sign up'}</button>
                    {loading && <span>...Loading</span>}
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