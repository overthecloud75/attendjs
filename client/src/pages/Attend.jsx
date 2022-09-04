import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/attend'
import Footer from '../components/Footer'

const Attend = () => {
    return (     
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/>
                <TableWithSearch 
                    searchKeyword='name'
                    page='attend'
                    url='/attend/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div>
        </div>  
    )
}

export default Attend