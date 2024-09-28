import Navbar from '../components/bar/Navbar'
import Footer from '../components/Footer'

const CheckEmail = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <h3 style={{textAlign: "center"}}>Plz Check Your Email to activate your account!</h3>
            <Footer/>
        </div>
    )
}
  
export default CheckEmail