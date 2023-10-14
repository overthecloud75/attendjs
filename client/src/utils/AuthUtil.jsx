import axios from 'axios'
import { loginUser, clearUser } from '../storage/userSlice.js'
import CryptoJS from 'crypto-js'

export const requestAuth = async (mode, method, value, dispatch, navigate, setErrorMsg, setLoading, location='') => {
    const url = '/api/auth/' + mode 
    setLoading(true)
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
        setLoading(false)
    } catch (err) {
        setErrorMsg(err.response.data.message)
        setLoading(false)
    } 
}