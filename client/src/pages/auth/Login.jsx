import { Box } from '@mui/material'
import Auth from '../../components/auth/Auth'
import Advertisement from '../../components/Advertisement'
import Feature from '../../components/Feature'
import Footer from '../../components/Footer'

const Login = () => {
    return (
        <div>
            <Feature />
            <Box sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <Advertisement />
                <Auth mode='login' />
            </Box>
            <Footer />
        </div>
    )
}

export default Login