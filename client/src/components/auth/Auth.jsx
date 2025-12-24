import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestAuth } from '../../utils/AuthUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { useLocation } from '../../hooks/useLocation'
import { useTurnstile } from '../../hooks/useTurnstile'
import { LoadingSpinner } from '../../utils/GeneralUtil'
import { authorityUrl, authorityClientID, authorityRedirectPath } from '../../configs/apiKey'

const Auth = ({ mode }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const { getLocation } = useLocation()
    const { width, height } = useWindowDimension()
    const { token } = useTurnstile(mode)

    const isLogin = mode === 'login'

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true)
            await requestAuth(mode, 'GET', '', dispatch, navigate, setErrorMsg)
            setLoading(false)
        }
        initAuth()
    }, [mode, dispatch, navigate])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const platform = navigator.userAgentData?.platform || ''
        const authData = { ...formData, width, height, token, platform }

        try {
            if (['Windows'].includes(platform)) {
                await requestAuth(mode, 'POST', authData, dispatch, navigate, setErrorMsg, '')
            } else {
                const loc = await getLocation()
                if (loc.error) {
                    setErrorMsg(loc.error)
                } else {
                    await requestAuth(mode, 'POST', authData, dispatch, navigate, setErrorMsg, loc.location)
                }
            }
        } catch (error) {
            setErrorMsg(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSSOLogin = (event) => {
        event.preventDefault()
        const params = new URLSearchParams({
            client_id: authorityClientID,
            response_type: 'code',
            redirect_uri: window.location.origin + authorityRedirectPath,
            response_mode: 'query',
            scope: 'User.Read'
        })
        window.location.href = `${authorityUrl}/oauth2/v2.0/authorize?${params.toString()}`
    }

    const { name, email, password } = formData

    return (
        <div style={styles.container}>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>{mode}</span>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <input
                                id='name'
                                type='text'
                                placeholder='name'
                                value={name}
                                onChange={handleInputChange}
                            />
                        )}
                        <input
                            id='email'
                            type='email'
                            placeholder='email'
                            value={email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            id='password'
                            type='password'
                            placeholder='password'
                            value={password}
                            onChange={handleInputChange}
                            required
                        />
                        {isLogin && <div id='cf-turnstile' />}
                        <button
                            disabled={loading}
                            style={styles.button}
                        >
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </button>

                        <p>
                            {isLogin ? "You don't have an account? " : "You do have an account? "}
                            <Link to={isLogin ? '/auth/register' : '/auth/login'}>
                                {isLogin ? 'Register' : 'Login'}
                            </Link>
                        </p>

                        <p>
                            You don't remember the password? <Link to='/auth/lost-password'>Lost Password</Link>
                        </p>

                        <div className='text-center'>또는</div>

                        {isLogin && (
                            <button
                                onClick={handleSSOLogin}
                                disabled={loading}
                                style={styles.ssoButton}
                            >
                                🔐 Microsoft 계정으로 로그인
                            </button>
                        )}

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
    button: {
        borderRadius: '8px',
        cursor: 'pointer',
    },
    ssoButton: {
        backgroundColor: '#2F2F91',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    }
}

export default Auth