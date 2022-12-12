import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestAuth } from '../utils/AuthUtil'

const Auth = ({mode}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [value, setValue] = useState(
        {
            name: '',
            email: '',
            password: ''
        }
    )
    const [err, setErr] = useState(false)

    useEffect(() => {
        requestAuth(mode, 'get', '', dispatch, navigate)
    // eslint-disable-next-line
    }, [mode])

    const handleChange = (event) => {
        setValue({...value, [event.target.id]: event.target.value})    
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const error = requestAuth(mode, 'post', value, dispatch, navigate)
        setErr(error)
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Attendance</span>
                <span className='title'>{mode}</span>
                <form onSubmit={handleSubmit}>
                    {!(mode==='login')&&(<input id='name' type='text' placeholder='name' onChange={handleChange}/>)}
                    <input id='email' type='email' placeholder='email' onChange={handleChange}/>
                    <input id='password' type='password' placeholder='password' onChange={handleChange}/>
                    <button>{mode==='login'?'Sign in':'Sign up'}</button>
                    {err && <span>Something went wrong</span>}
                </form>
                {mode==='login'?
                    (<p>You don't have an account? <Link to='/register'>Register</Link></p>):
                    (<p>You do have an account? <Link to='/login'>Login</Link></p>)
                }
            </div>
        </div>
    )
  }
  
  export default Auth