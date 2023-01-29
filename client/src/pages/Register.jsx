import Navbar from '../components/Navbar'
import Auth from '../components/Auth'
import Footer from '../components/Footer'

const Register = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <Auth
                mode='register'
            />
            <Footer/>
        </div>
    )
}

export default Register