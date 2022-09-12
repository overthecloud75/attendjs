import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../storage/userSlice.js'
import axios from 'axios'

const Auth = ({mode}) => {
    const dispatch = useDispatch()

    const [value, setValue] = useState(
        {
            name: '',
            email: '',
            password: ''
        }
    )
    const [err, setErr] = useState(false)
    const navigate = useNavigate()

    const handleChange = (event) => {
        setValue({...value, [event.target.id]: event.target.value})    
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const url = '/auth/' + mode
        try {
            const res = await axios.post(url, value)
            if (mode === 'login') {
                dispatch(loginUser(res.data)) 
            }
            navigate('/')
        } catch (err) {
            console.log(err)
            setErr(true)
        }
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