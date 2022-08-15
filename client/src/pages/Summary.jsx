import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { summaryColumnHeaders, summaryCsvHeaders } from '../config'
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
                    url='/summary/search'
                    columnHeaders={summaryColumnHeaders}
                    csvHeaders={summaryCsvHeaders}
                />
                <Footer/>
            </div>
        </div>
    )
}

export default Summary