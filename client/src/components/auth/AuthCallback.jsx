import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestAuth } from '../../utils/AuthUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { useLocation } from '../../hooks/useLocation'
import { LoadingSpinner } from '../../utils/GeneralUtil'
import { authorityRedirectPath } from '../../configs/apiKey'

const AuthCallback = ({mode}) => {
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
        const redirect_uri = window.location.origin + authorityRedirectPath
        if (code && session_state) {
            handleSubmit({code, session_state, redirect_uri})
        } else {
            setErrorMsg('Invalid Code')
        }
    }, [mode, dispatch, navigate])

    const handleSubmit = async (formData) => {
        setLoading(true)
        const platform = navigator.userAgentData?.platform || ''
        const authData = { ...formData, width, height, platform }

        try {
            if (['Windows'].includes(platform)){
                await requestAuth(mode, 'POST', authData, dispatch, navigate, setErrorMsg, '')
            } else {
                const loc = await getLocation()
                const location = loc.location
                if (loc.error) {
                    setErrorMsg(loc.error)
                } else {
                    await requestAuth(mode, 'POST', authData, dispatch, navigate, setErrorMsg, location)
                }
            }
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
                <span className='title'>{mode}</span>
                <form onSubmit={handleSubmit}>
                    {(mode !=='login' )&& (
                        <input 
                            id='name' 
                            type='text' 
                            placeholder='name'
                        />)}
                    <input 
                        id='email' 
                        type='email' 
                        placeholder='email'
                        required
                    />
                    <input 
                        id='password' 
                        type='password' 
                        placeholder='password'
                        required
                    />
                    <button 
                        disabled={loading}
                        style={{
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        Sign in
                    </button>
                    <button
                        disabled={loading}
                        style={{
                            backgroundColor: '#2F2F91',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        🔐 Microsoft 계정으로 로그인
                    </button>
                    {loading && <LoadingSpinner />}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
            </div>
        </div>
    )
}
  
export default AuthCallback