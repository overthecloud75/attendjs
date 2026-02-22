import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ProtectedRoute = ({ children }) => {
    const { isLogin } = useAuth()

    if (!isLogin) {
        // If not logged in, redirect to login page
        return <Navigate to="/auth/login" replace />
    }

    // If logged in, render the children components
    return children
}

export default ProtectedRoute
