import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { columnHeaders, csvHeaders } from '../configs/summary'
import Footer from '../components/Footer'

const Summary = () => {
    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>  
                <Navbar/>   
                <TableWithSearch 
                    searchKeyword='name'
                    page ='summary'
                    url='/api/summary/search'
                    columnHeaders={columnHeaders}
                    csvHeaders={csvHeaders}
                />
                <Footer/>
            </div>
        </div>
    )
}

export default Summary