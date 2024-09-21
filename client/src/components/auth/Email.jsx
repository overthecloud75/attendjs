import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import styled from 'styled-components'
import { requestLostPassword } from '../../utils/AuthUtil'

const Container = styled.div`
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`

const Email = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        setLoading(true)
        requestLostPassword('get', '', navigate, setErrorMsg)
        setLoading(false)
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const email = document.getElementById('email').value
        setLoading(true)
        if (email) {
            requestLostPassword('post', {email}, navigate, setErrorMsg)
        } 
        setLoading(false)
    }

    return (
        <Container>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='logo'>SmartWork</span>
                    <span className='title'>Verify Email</span>
                    <form onSubmit={handleSubmit}>
                        <input id='email' type='email' placeholder='email' />
                        <button disabled={loading}>Confirm Email</button>
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
  
export default Email