import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/location'
import Footer from '../components/Footer'

const Location = () => {
    return (    
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'> 
                <Navbar/> 
                <TableWithSearch 
                    searchKeyword='name'
                    page ='location'
                    url='/location/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div> 
        </div>
    )
}

export default Location