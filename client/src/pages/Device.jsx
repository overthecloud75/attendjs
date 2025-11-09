import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import CoustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/device'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const Device = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()
    const { isMobile } = useResponsive()

    return (    
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <CoustomTableWithSearch 
                    searchKeyword='mac'
                    page ='device'
                    url='/api/device/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
            </div> 
        </div>
    )
}

export default Device