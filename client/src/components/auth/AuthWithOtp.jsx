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
        const { email, otp, password, password2 } = formData
        if (password !== password2) {
            setErrorMsg('비밀번호가 일치하지 않습니다.')
            return false
        }
        if (!email || !otp || !password) {
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
            const { email, otp, password } = formData
            await requestPasswordWithOtp(
                'post',
                { email, otp, password, token },
                navigate,
                setErrorMsg
            )
        } catch (error) {
            setErrorMsg(error)
        } finally {
            setLoading(false)
        }
    }

    const { email, otp, password, password2 } = formData

    return (
        <div style={styles.container}>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <h3 style={styles.headerText}>
                        이메일로 발송된 OTP 코드를 확인해주세요.
                    </h3>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>비밀번호 재설정</span>
                    <form onSubmit={handleSubmit}>
                        <input
                            id='email'
                            type='email'
                            placeholder='email'
                            value={email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            id='otp'
                            placeholder='OTP 코드'
                            value={otp}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            id='password'
                            type='password'
                            placeholder='새 비밀번호'
                            value={password}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            id='password2'
                            type='password'
                            placeholder='새 비밀번호 확인'
                            value={password2}
                            onChange={handleInputChange}
                            required
                        />
                        <div id='cf-turnstile' style={{ width: '100%', margin: '15px 0' }} />
                        <button disabled={loading} style={styles.submitButton}>비밀번호 재설정</button>
                        {loading && <LoadingSpinner />}
                        {!loading && errorMsg && <span>{errorMsg}</span>}
                    </form>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        flex: 1
    },
    headerText: {
        textAlign: 'center',
        color: 'var(--text-active)',
        fontSize: '16px',
        marginBottom: '20px',
        fontWeight: '600'
    },
    submitButton: {
        borderRadius: '8px',
        cursor: 'pointer'
    }
}

export default AuthWithOtp