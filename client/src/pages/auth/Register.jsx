import Auth from '../../components/auth/Auth'
import Advertisement from '../../components/Advertisement'
import Feature from '../../components/Feature'
import Footer from '../../components/Footer'

const Register = () => {   
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
                <Auth mode='register'/>
            </div>
            <Footer/>
        </div>
    )
}

export default Register