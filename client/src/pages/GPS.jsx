import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/gps'
import Footer from '../components/Footer'

const GPS = () => {
    return (   
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'> 
                <Navbar/>   
                <TableWithSearch 
                    searchKeyword='name'
                    page='gps-attend'
                    url='/gps-attend/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div>
        </div>
    )
}

export default GPS