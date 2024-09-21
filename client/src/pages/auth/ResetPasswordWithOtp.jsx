import Navbar from '../../components/Navbar'
import AuthWithOtp from '../../components/auth/AuthWithOtp'
import Footer from '../../components/Footer'

const ResetPasswordWithOtp = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <h3 style={{textAlign: "center"}}>Plz Check Your Email to check OTP!</h3>
            <AuthWithOtp/>
            <Footer/>
        </div>
    )
}
  
export default ResetPasswordWithOtp