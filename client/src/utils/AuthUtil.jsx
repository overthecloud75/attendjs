import axios from 'axios'
import { loginUser, clearUser } from '../storage/userSlice.js'

export const requestAuth = async (mode, method, value, dispatch, navigate, setErrorMsg, setLoading) => {
    const url = '/api/auth/' + mode 
    setLoading(true)
    try {
        if (method === 'post') {
            const res = await axios.post(url, value)
            if (mode === 'login') {
                dispatch(loginUser(res.data)) 
                if (value.location) {
                    navigate('/', {state : {latitude: value.location.latitude, longitude: value.location.longitude}})
                } else {
                    navigate('/')
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