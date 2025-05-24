import AuthWithOtp from '../../components/auth/AuthWithOtp'
import Advertisement from '../../components/Advertisement'
import Feature from '../../components/Feature'
import Footer from '../../components/Footer'

const ResetPasswordWithOtp = () => {   
    return (
        <div>
            <Feature />
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <Advertisement/>
                <AuthWithOtp/>
            </div>
            <Footer/>
        </div>
    )
}
  
export default ResetPasswordWithOtp

