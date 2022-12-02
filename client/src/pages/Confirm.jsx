import { useParams} from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import CheckConfirm from '../components/CheckConfirm'
import Footer from '../components/Footer'

const Confirm = () => {

    let { confirmationCode } = useParams();
    console.log('code', confirmationCode)

    return (     
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/>
                <CheckConfirm 
                    url={ '/confirm/token/' + confirmationCode } 
                />
                <Footer/>
            </div>
        </div>  
    )
}

export default Confirm