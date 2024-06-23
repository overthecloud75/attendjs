import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/wifi'
import Footer from '../components/Footer'

const Wifi = ({menu, setMenu}) => {
    return (   
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/>  
                <TableWithSearch 
                    searchKeyword='ip'
                    page='wifi-attend'
                    url='/api/wifi-attend/search'
                    columnHeaders={window.innerWidth>600?columnHeaders:mobileColumnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div>
        </div>
    )
}

export default Wifi