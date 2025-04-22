import Navbar from '../../components/bar/Navbar'
import AuthCallback from '../../components/auth/AuthCallback'
import Footer from '../../components/Footer'

const Callback = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <AuthCallback
                mode='callback'
            />
            <Footer/>
        </div>
    )
}
  
export default Callback