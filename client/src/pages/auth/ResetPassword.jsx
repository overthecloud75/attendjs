import Navbar from '../../components/Navbar'
import Password from '../../components/auth/Password'
import Footer from '../../components/Footer'

const ResetPassword = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <Password/>
            <Footer/>
        </div>
    )
}
  
export default ResetPassword