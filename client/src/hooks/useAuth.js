import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearUser } from '../storage/userSlice'
import axios from 'axios'

/**
 * useAuth hook - Centralizes authentication and authorization logic
 * @returns {Object} { user, isLogin, isAdmin, logout }
 */
export const useAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    // Authorization helpers
    const isAdmin = user?.isAdmin === true

    /**
     * Handles global logout logic
     */
    const logout = async (setErrorMsg = null) => {
        try {
            await axios.get('/api/auth/logout')
        } catch (error) {
            console.error('Logout failed on server:', error)
            if (setErrorMsg) setErrorMsg(error?.response?.data?.message || '로그아웃 실패')
        } finally {
            sessionStorage.removeItem('user')
            dispatch(clearUser())
            navigate('/auth/login', { replace: true })
        }
    }

    return {
        user,
        isLogin: user?.isLogin,
        isAdmin,
        logout
    }
}

export default useAuth
