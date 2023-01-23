import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/wifi'
import Footer from '../components/Footer'

const Wifi = () => {
    return (   
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'> 
                <Navbar/>   
                <TableWithSearch 
                    searchKeyword='ip'
                    page='wifi-attend'
                    url='/api/wifi-attend/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div>
        </div>
    )
}

export default Wifi