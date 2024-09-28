import Navbar from '../../components/bar/Navbar'
import Auth from '../../components/auth/Auth'
import Footer from '../../components/Footer'

const Login = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <Auth
                mode='login'
            />
            <Footer/>
        </div>
    )
}
  
export default Login