import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CheckEmail = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <div>Plz Check Your Email to activate your account!</div>
            <Footer/>
        </div>
    )
}
  
export default CheckEmail