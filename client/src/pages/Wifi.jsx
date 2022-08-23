import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { wifiColumnHeaders, wifiCsvHeaders } from '../config'
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
                    url='/wifi-attend/search'
                    columnHeaders={wifiColumnHeaders}
                    csvHeaders={wifiCsvHeaders}
                />
                <Footer/>
            </div>
        </div>
    )
}

export default Wifi