import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { deviceColumnHeaders, deviceCsvHeaders } from '../config'
import Footer from '../components/Footer'

const Device = () => {
    return (    
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'> 
                <Navbar/> 
                <TableWithSearch 
                    searchKeyword='mac'
                    page ='device'
                    url='/device/search'
                    columnHeaders={deviceColumnHeaders}
                    csvHeaders={deviceCsvHeaders}
                />
                <Footer/>
            </div> 
        </div>
    )
}

export default Device