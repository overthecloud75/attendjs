import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/user'
import Footer from '../components/Footer'
import NotFound from './NotFound'

const User = () => {
    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>  
                <Navbar/>   
                <NotFound/>
                <Footer/>
            </div>
        </div>
    )
}

export default User