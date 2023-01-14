import Navbar from '../components/Navbar'
import Auth from '../components/Auth'
import Footer from '../components/Footer'

const Login = () => {   
    return (
        <div>
            <Navbar/> 
            <Auth
                mode='login'
            />
            <Footer/>
        </div>
    )
}
  
export default Login