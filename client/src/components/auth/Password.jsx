import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Box, CircularProgress } from '@mui/material'
import { requestPassword } from '../../utils/AuthUtil.jsx'
import { getUser } from '../../storage/userSlice.js'

const Container = styled.div`
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`

const Password = () => {
    const user = useMemo(() => getUser(), [])
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        setLoading(true)
        requestPassword('get', '', navigate, setErrorMsg)
        setLoading(false)
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const currentPassword = document.getElementById('currentPassword').value
        const newPassword = document.getElementById('newPassword').value
        const newPassword2 = document.getElementById('newPassword2').value
        setLoading(true)
        if (newPassword === newPassword2) {
            requestPassword('post', {email: user.email, currentPassword, newPassword}, navigate, setErrorMsg)
        } else {
            alert('비밀번호가 일치 하지 않습니다.')
        }
        setLoading(false)
    }

    return (
        <Container>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>Reset Password</span>
                    <form onSubmit={handleSubmit}>
                        <input id='currentPassword' type='password' placeholder='current password' />
                        <input id='newPassword' type='password' placeholder='new password' />
                        <input id='newPassword2' type='password' placeholder='new password' />
                        <button disabled={loading}>Reset Password</button>
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
        </Container>
    )
}
  
export default Password