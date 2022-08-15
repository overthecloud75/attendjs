import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { attendColumnHeaders, attendCsvHeaders } from '../config'
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
                    columnHeaders={attendColumnHeaders}
                    csvHeaders={attendCsvHeaders}
                />
                <Footer/>
            </div>
        </div>  
    )
}

export default Attend