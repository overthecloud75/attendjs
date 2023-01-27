import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/loginhistory'
import Footer from '../components/Footer'

const LoginHistory = () => {
    return (     
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/>
                <TableWithSearch 
                    searchKeyword='name'
                    page='loginhistory'
                    url='/api/auth/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div>
        </div>  
    )
}

export default LoginHistory