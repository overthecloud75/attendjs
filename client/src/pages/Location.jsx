import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import CoustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/location'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const Location = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()
    const { isMobile } = useResponsive()

    return (    
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <CoustomTableWithSearch 
                    searchKeyword='name'
                    page ='location'
                    url='/api/location/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
            </div> 
        </div>
    )
}

export default Location