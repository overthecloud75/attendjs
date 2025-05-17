import Password from '../../components/auth/Password'
import Advertisement from '../../components/Advertisement'
import Feature from '../../components/Feature'
import Footer from '../../components/Footer'

const ResetPassword = () => {   
    return (
        <div>
            <Feature />
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minHeight: 'calc(100vh - 140px)',
            }}>
                <Advertisement/>
                <Password/>
            </div>
            <Footer/>
        </div>
    )
}
  
export default ResetPassword
