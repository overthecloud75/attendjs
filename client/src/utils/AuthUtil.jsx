import axios from 'axios'
import { loginUser, clearUser } from '../storage/userSlice'
import CryptoJS from 'crypto-js'

export const requestAuth = async (mode, method, value, dispatch, navigate, setErrorMsg, location='') => {
    const url = '/api/auth/' + mode 
    try {
        if (method === 'post') {
            const res = await axios.post(url, value)
            if (mode === 'login') {
                dispatch(loginUser(res.data))
                if (res.data.where.attend) {
                    navigate('/', {state : {location, where: res.data.where}})
                } else if (res.data.where.isMobile === 'O') {
                    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(location), res.data.hash.toString()).toString()
                    const resAttend = await axios.post('/api/auth/setAttend', {location: ciphertext})
                    navigate('/', {state : {location, where: resAttend.data.where}})
                } else {
                    navigate('/attend')
                }
            } else if (mode === 'register') {
                navigate('/check-email')
            }  
        } else {
            const res = await axios.get(url)
            if (mode === 'logout') {
                dispatch(clearUser())
                navigate('/')
            } else {
                axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
            }
        }
    } catch (err) {
        setErrorMsg(err.response.data.message)
    }
}

export const requestPassword = async (method, value, navigate, setErrorMsg) => {
    const url = '/api/auth/password'
    try {
        if (method === 'post') {
            await axios.post(url, value)
            navigate('/attend')
        } else {
            const res = await axios.get(url)
            axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
        }
    } catch (err) {
        setErrorMsg(err.response.data.message)
    }
}

export const requestLostPassword = async (method, value, navigate, setErrorMsg) => {
    const url = '/api/auth/lost-password'
    try {
        if (method === 'post') {
            await axios.post(url, value)
            navigate('/auth/reset-password-with-otp', {state: value})
        } else {
            const res = await axios.get(url)
            axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
        }
    } catch (err) {
        setErrorMsg(err.response.data.message)
    }
}

export const requestPasswordWithOtp = async (method, value, navigate, setErrorMsg) => {
    const url = '/api/auth/password-with-otp'
    try {
        if (method === 'post') {
            await axios.post(url, value)
            navigate('/auth/login')
        } else {
            const res = await axios.get(url)
            axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken
        }
    } catch (err) {
        setErrorMsg(err.response.data.message)
    }
}