import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { requestPassword } from '../../utils/AuthUtil'
import { getUser } from '../../storage/userSlice'
import { LoadingSpinner } from '../../utils/GeneralUtil'

const Password = () => {
    const user = useMemo(() => getUser(), [])
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        newPassword2: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true)
            await requestPassword('GET', '', navigate, setErrorMsg)
            setLoading(false)
        }
        initAuth()
    }, [navigate])

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const { currentPassword, newPassword, newPassword2 } = formData

        if (!currentPassword || !newPassword || !newPassword2) {
            setErrorMsg('모든 필드를 입력해주세요.')
            return
        }

        if (newPassword !== newPassword2) {
            setErrorMsg('새 비밀번호가 일치하지 않습니다.')
            return
        }

        setLoading(true)
        try {
            await requestPassword('POST', {
                email: user.email,
                currentPassword,
                newPassword
            }, navigate, setErrorMsg)
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
                <span className='title'>비밀번호 재설정</span>
                <form onSubmit={handleSubmit}>
                    <input 
                        id='currentPassword' 
                        type='password' 
                        placeholder='현재 비밀번호'
                        value={formData.currentPassword}
                        onChange={handleChange}
                    />
                     <input
                        id='newPassword'
                        type='password'
                        placeholder='새 비밀번호'
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                    <input
                        id='newPassword2'
                        type='password'
                        placeholder='새 비밀번호 확인'
                        value={formData.newPassword2}
                        onChange={handleChange}
                    />
                    <button disabled={loading} style={{borderRadius: '8px', cursor: 'pointer'}}>비빌번호 변경</button>
                    {loading && <LoadingSpinner />}
                    {!loading && errorMsg && <span>{errorMsg}</span>}
                </form>
            </div>
        </div>
    )
}
  
export default Password