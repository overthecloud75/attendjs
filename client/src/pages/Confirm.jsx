import { useParams} from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import CheckConfirm from '../components/CheckConfirm'
import Footer from '../components/Footer'

const Confirm = ({menu, setMenu}) => {

    let { confirmationCode } = useParams();
    console.log('code', confirmationCode)

    return (     
        <div className='container'>
            {menu && <Sidebar/>}
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