import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestAuth } from '../../utils/AuthUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { useLocation } from '../../hooks/useLocation'
import { useTurnstile } from '../../hooks/useTurnstile'
import { LoadingSpinner } from '../../utils/GeneralUtil'

const Auth = ({mode}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    console.log('errorMsg', errorMsg)
    const { getLocation } = useLocation()
    const { width, height } = useWindowDimension()

    const { token } = useTurnstile(mode)

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
                            value={formData.name}
                            onChange={handleInputChange}
                        />)}
                    <input 
                        id='email' 
                        type='email' 
                        placeholder='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input 
                        id='password' 
                        type='password' 
                        placeholder='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    {(mode === 'login') && (<div id='cf-turnstile' />)}
                    <button disabled={loading}>{mode==='login'?'Sign in':'Sign up'}</button>
                    {loading && <LoadingSpinner />}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
                {mode === 'login' ?
                    (<p>You don't have an account? <Link to='/auth/register'>Register</Link></p>):
                    (<p>You do have an account? <Link to='/auth/login'>Login</Link></p>)
                }
                <p>You don't remember the password? <Link to='/auth/lost-password'>Lost Password</Link></p>
            </div>
        </div>
    )
}
  
export default Auth