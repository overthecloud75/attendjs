import axios from 'axios'
import { loginUser, clearUser } from '../storage/userSlice.js'
import CryptoJS from 'crypto-js'

export const requestAuth = async (mode, method, value, dispatch, navigate, setErrorMsg, setLoading, locations=[]) => {
    const url = '/api/auth/' + mode 
    setLoading(true)
    try {
        if (method === 'post') {
            const res = await axios.post(url, value)
            if (mode === 'login') {
                dispatch(loginUser(res.data)) 
                if (res.data.where.attend) {
                    navigate('/', {state : {location: locations[1], where: res.data.where}})
                } else if (res.data.where.isMobile === 'O' || res.data.where.isMobile === 'X') {
                    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(locations), res.data.hash.toString()).toString()
                    const resAttend = await axios.post('/api/auth/setAttend', {locations: ciphertext})
                    navigate('/', {state : {location: locations[1], where: resAttend.data.where}})
                } else {
                    navigate('/attend')
                }
            } else if (mode === 'register') {
                navigate('/check-email')
            }  
        }
        else {
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