import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestAuth } from '../../utils/AuthUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { useLocation } from '../../hooks/useLocation'
import { LoadingSpinner } from '../../utils/GeneralUtil'
import { authorityRedirectPath } from '../../configs/apiKey'

const AuthCallback = ({ mode }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const { getLocation } = useLocation()
    const { width, height } = useWindowDimension()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const session_state = params.get('session_state')
        const redirect_uri = `${window.location.origin}${authorityRedirectPath}`

        if (code && session_state) {
            handleSubmit({ code, session_state, redirect_uri })
        } else {
            setErrorMsg('인증 코드가 유효하지 않습니다.')
        }
    }, [mode, dispatch, navigate])

    const handleSubmit = async (formData) => {
        setLoading(true)
        const platform = navigator.userAgentData?.platform || ''
        const authData = { ...formData, width, height, platform }

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

    return (
        <div style={styles.container}>
            <div className='formContainer'>
                <div className='formWrapper' style={styles.wrapper}>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>로그인 처리 중</span>

                    <div style={styles.statusContainer}>
                        {loading ? (
                            <div style={styles.loadingWrapper}>
                                <LoadingSpinner />
                                <p style={styles.loadingText}>잠시만 기다려주세요...</p>
                            </div>
                        ) : errorMsg && (
                            <div style={styles.error}>
                                {errorMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        flex: 1
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    statusContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0'
    },
    loadingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    },
    loadingText: {
        color: '#666',
        fontSize: '14px'
    },
    error: {
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '14px',
        width: '100%',
        textAlign: 'center'
    }
}

export default AuthCallback