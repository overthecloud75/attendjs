import Navbar from '../components/Navbar'
import Auth from '../components/Auth'
import Footer from '../components/Footer'

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