import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/board'
import Footer from '../components/Footer'

const Report = () => {
    return (    
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'> 
                <Navbar/> 
                <TableWithSearch 
                    searchKeyword='name'
                    page ='report'
                    url='/report/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div> 
        </div>
    )
}

export default Report