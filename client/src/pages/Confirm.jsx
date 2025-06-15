import { useParams} from 'react-router-dom'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import CheckConfirm from '../components/CheckConfirm'
import Footer from '../components/Footer'

const Confirm = ({menu, setMenu}) => {

    let { confirmationCode } = useParams()

    return (     
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <CheckConfirm 
                    url={ '/api/confirm/token/' + confirmationCode } 
                />
                {menu && <Footer/>}
            </div>
        </div>  
    )
}

export default Confirm