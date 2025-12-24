import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const useRedirectIfNotAuthenticated = (redirectTo = '/auth/login') => {
    const navigate = useNavigate()
    const user = useSelector(state => state.user)

    useEffect(() => {
        if (!user.isLogin) {
            navigate(redirectTo, { replace: true });
        }
    }, [navigate, redirectTo])
}