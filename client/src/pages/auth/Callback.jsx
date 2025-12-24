import AuthCallback from '../../components/auth/AuthCallback'
import Advertisement from '../../components/Advertisement'
import Feature from '../../components/Feature'
import Footer from '../../components/Footer'

const Callback = () => {   
    return (
        <div>
            <Feature />
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
                <Advertisement/>
                <AuthCallback
                    mode='callback'
                />
            </div>
            <Footer/>
        </div>
    )
}
  
export default Callback