import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/employee'
import Footer from '../components/Footer'

const Employee = () => {
    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>  
                <Navbar/>   
                <TableWithSearch 
                    searchKeyword='name'
                    page ='employee'
                    url='/api/employee/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div>
        </div>
    )
}

export default Employee