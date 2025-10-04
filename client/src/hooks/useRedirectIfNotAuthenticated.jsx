import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../storage/userSlice'

export const useRedirectIfNotAuthenticated = (redirectTo = '/auth/login') => {
    const navigate = useNavigate()
    const user = getUser()

    useEffect(() => {
        if (!user.isLogin) {
            navigate(redirectTo, { replace: true });
        }
    }, [navigate, redirectTo])
}