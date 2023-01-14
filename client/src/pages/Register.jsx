import Navbar from '../components/Navbar'
import Auth from '../components/Auth'
import Footer from '../components/Footer'

const Register = () => {   
    return (
        <div>
            <Navbar/> 
            <Auth
                mode='register'
            />
            <Footer/>
        </div>
    )
}

export default Register