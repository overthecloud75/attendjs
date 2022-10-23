import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Auth from '../components/Auth'
import Footer from '../components/Footer'

const Login = () => {   
    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/> 
                <Auth
                    mode='login'
                />
                <Footer/>
            </div>
        </div>
    )
}
  
export default Login