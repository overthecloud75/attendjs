import axios from 'axios'
import { loginUser, clearUser } from '../storage/userSlice'
import CryptoJS from 'crypto-js'

const API_BASE_URL = '/api/auth'
// 공통 axios 요청 함수
const makeRequest = async (endpoint, method, data = null) => {
    const url = `${API_BASE_URL}/${endpoint}`
    try {
        if (method === 'POST') {
            return await axios.post(url, data)
        }
        const response = await axios.get(url)
        if (response.headers.csrftoken) {
            axios.defaults.headers.post['X-CSRF-Token'] = response.headers.csrftoken
        }
        return response
    } catch (error) {
        throw error?.response?.data?.message || '서버 오류가 발생했습니다.'
    }
}

// 로그인 성공 후 처리 함수
const handleLoginSuccess = async (responseData, location, navigate) => {
    console.log('response', responseData)
    const { where, hash } = responseData

    if (where.attend) {
        navigate('/map', { state: { location, where } })
        return
    }
    
    if (where.isMobile === 'O') {
        const ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(location), 
            hash.toString()
        ).toString()
        const resAttend = await makeRequest('setAttend', 'POST', { location: ciphertext })
        navigate('/map', { state: { location, where: resAttend.data.where } })
        return
    }
    console.log('attend')
    navigate('/attend')
}

export const requestAuth = async (
    mode, 
    method, 
    value, 
    dispatch, 
    navigate, 
    setErrorMsg, 
    location=''
) => {
    try {
        const response = await makeRequest(mode, method, value)
        if ((mode === 'login' || mode === 'callback') && method === 'POST') {
            dispatch(loginUser(response.data))
            await handleLoginSuccess(response.data, location, navigate)
        } else if (mode === 'register' && method === 'POST') {
            navigate('/check-email')
        } else if (mode === 'logout' && method === 'GET') {
            dispatch(clearUser())
            navigate('/')
        }
    } catch (error) {
        setErrorMsg(error)
    }
}

// 비밀번호 관련 요청 처리 기본 함수
const handlePasswordRequest = async (endpoint, method, value, navigate, setErrorMsg, successPath) => {
    try {
        await makeRequest(endpoint, method, value)
        if (method === 'POST' && successPath) {
            navigate(successPath, value ? { state: value } : undefined)
        }
    } catch (error) {
        setErrorMsg(typeof error === 'string' ? error : '처리 중 오류가 발생했습니다.')
    }
}

export const requestPassword = async (method, value, navigate, setErrorMsg) => {
    await handlePasswordRequest('password', method, value, navigate, setErrorMsg, '/attend')
}

export const requestLostPassword = async (method, value, navigate, setErrorMsg) => {
    await handlePasswordRequest('lost-password', method, value, navigate, setErrorMsg, '/auth/reset-password-with-otp')
}

export const requestPasswordWithOtp = async (method, value, navigate, setErrorMsg) => {
    await handlePasswordRequest('password-with-otp', method, value, navigate, setErrorMsg, '/auth/login')
}

