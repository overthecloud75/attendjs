import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestLostPassword } from '../../utils/AuthUtil'
import { LoadingSpinner } from '../../utils/GeneralUtil'

const Email = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true)
            await requestLostPassword('GET', '', navigate, setErrorMsg)
            setLoading(false)
        }
        initAuth()
    }, [navigate])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!formData.email) {
            setErrorMsg('이메일을 입력해주세요.')
            return
        }
        try {
            setLoading(true)
            await requestLostPassword('POST', formData, navigate, setErrorMsg)
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
                <span className='title'>이메일 확인</span>
                <form onSubmit={handleSubmit}>
                    <input 
                        id='email' 
                        type='email' 
                        placeholder='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <button disabled={loading} style={{borderRadius: '8px', cursor: 'pointer'}}>이메일 확인</button>
                    {loading && <LoadingSpinner />}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
            </div>
        </div>
    )
}
  
export default Email