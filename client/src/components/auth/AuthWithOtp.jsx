import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestPasswordWithOtp } from '../../utils/AuthUtil'
import { useTurnstile } from '../../hooks/useTurnstile'
import { LoadingSpinner } from '../../utils/GeneralUtil'

const AuthWithOtp = () => {
    const { state } = useLocation()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: state?.email || '',
        otp: '',
        password: '',
        password2: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const { token } = useTurnstile('login')

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true)
            await requestPasswordWithOtp('GET', '', navigate, setErrorMsg)
            setLoading(false)
        }
        initAuth()
    }, [navigate])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const validateForm = () => {
        if (formData.password !== formData.password2) {
            setErrorMsg('비밀번호가 일치하지 않습니다.')
            return false
        }
        if (!formData.email || !formData.otp || !formData.password) {
            setErrorMsg('모든 필드를 입력해주세요.')
            return false
        }
        return true
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validateForm()) return
        try {
            setLoading(true)
            await requestPasswordWithOtp(
                'post', 
                {
                    email: formData.email, 
                    otp: formData.otp, 
                    password: formData.password, 
                    token
                }, 
                navigate, 
                setErrorMsg
            )
        } catch (error) {
            setErrorMsg(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>SmartWork</span>
                <span className='title'>비밀번호 재설정</span>
                <form onSubmit={handleSubmit}>
                    <input 
                        id='email' 
                        type='email' 
                        placeholder='email' 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                     <input
                        id='otp'
                        placeholder='OTP 코드'
                        value={formData.otp}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        id='password'
                        type='password'
                        placeholder='새 비밀번호'
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        id='password2'
                        type='password'
                        placeholder='새 비밀번호 확인'
                        value={formData.password2}
                        onChange={handleInputChange}
                        required
                    />
                    <div id='cf-turnstile'/>
                    <button disabled={loading}>비밀번호 재설정</button>
                    {loading && <LoadingSpinner />}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
            </div>
        </div>
    )
}
  
export default AuthWithOtp