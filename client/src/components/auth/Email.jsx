import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { requestLostPassword } from '../../utils/AuthUtil'

const Email = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)

    useEffect(() => {
        requestLostPassword('get', '', navigate, setErrorMsg, setLoading)
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const email = document.getElementById('email').value
        if (!buttonClicked) {
            setButtonClicked((click) => !click)
            if (email) {
                requestLostPassword('post', {email}, navigate, setErrorMsg, setLoading)
            } 
            setButtonClicked((click) => !click)
        } 
    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>SmartWork</span>
                <span className='title'>Verify Email</span>
                <form onSubmit={handleSubmit}>
                    <input id='email' type='email' placeholder='email' />
                    <button>Confirm Email</button>
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
  
export default Email