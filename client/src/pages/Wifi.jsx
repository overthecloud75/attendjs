import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/wifi'
import Footer from '../components/Footer'

const Wifi = ({menu, setMenu}) => {

    const { isMobile } = useResponsive()

    return (   
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/>  
                <TableWithSearch 
                    searchKeyword='ip'
                    page='wifi-attend'
                    url='/api/wifi-attend/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div>
        </div>
    )
}

export default Wifi