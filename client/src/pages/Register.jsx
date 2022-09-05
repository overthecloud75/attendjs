import { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
    const [err, setErr] = useState(false)

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Attendance Chat</span>
                <span className='title'>Register</span>
                <form>
                    <input type='text' placeholder='display id' />
                    <input type='email' placeholder='email'/>
                    <input type='password' placeholder='password'/>
                    <button>Sign up</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>You do have an account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    )
}

export default Register