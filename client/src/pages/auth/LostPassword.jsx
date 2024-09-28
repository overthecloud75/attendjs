import Navbar from '../../components/bar/Navbar'
import Email from '../../components/auth/Email'
import Footer from '../../components/Footer'

const LostPassword = ({menu, setMenu}) => {   
    return (
        <div>
            <Navbar menu={menu} setMenu={setMenu}/> 
            <Email/>
            <Footer/>
        </div>
    )
}
  
export default LostPassword