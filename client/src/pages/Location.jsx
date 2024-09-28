import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/location'
import Footer from '../components/Footer'

const Location = ({menu, setMenu}) => {
    return (    
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <TableWithSearch 
                    searchKeyword='name'
                    page ='location'
                    url='/api/location/search'
                    columnHeaders={window.innerWidth>600?columnHeaders:mobileColumnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div> 
        </div>
    )
}

export default Location