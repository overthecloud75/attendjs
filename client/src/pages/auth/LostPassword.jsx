import Email from '../../components/auth/Email'
import Advertisement from '../../components/Advertisement'
import Feature from '../../components/Feature'
import Footer from '../../components/Footer'

const LostPassword = () => {   
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
                <Email/>
            </div>
            <Footer/>
        </div>
    )
}
  
export default LostPassword