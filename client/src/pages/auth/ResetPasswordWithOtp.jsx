import Navbar from '../../components/Navbar'
import AuthWithOtp from '../../components/auth/AuthWithOtp'
import Footer from '../../components/Footer'

const ResetPasswordWithOtp = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <AuthWithOtp/>
            <Footer/>
        </div>
    )
}
  
export default ResetPasswordWithOtp