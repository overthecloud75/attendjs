import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { requestPassword } from '../../utils/AuthUtil.jsx'
import { getUser } from '../../storage/userSlice.js'

const Password = () => {
    const user = getUser()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)

    useEffect(() => {
        requestPassword('get', '', navigate, setErrorMsg, setLoading)
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const currentPassword = document.getElementById('currentPassword').value
        const newPassword = document.getElementById('newPassword').value
        const newPassword2 = document.getElementById('newPassword2').value
        if (!buttonClicked) {
            setButtonClicked((click) => !click)
            if (newPassword === newPassword2) {
                requestPassword('post', {email: user.email, currentPassword, newPassword}, navigate, setErrorMsg, setLoading)
            } else {
                alert('비밀번호가 일치 하지 않습니다.')
            }
            setButtonClicked((click) => !click)
        } 
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>SmartWork</span>
                <span className='title'>Reset Password</span>
                <form onSubmit={handleSubmit}>
                    <input id='currentPassword' type='password' placeholder='current password' />
                    <input id='newPassword' type='password' placeholder='new password' />
                    <input id='newPassword2' type='password' placeholder='new password' />
                    <button>Reset Password</button>
                    {loading && 
                        <span>
                            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                <CircularProgress/>
                            </Box>
                        </span>}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
            </div>
        </div>
    )
}
  
export default Password