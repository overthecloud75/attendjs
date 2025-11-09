import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import CoustomTableWithSearch from '../components/tables/CustomTableWithSearch.jsx'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/approval.jsx'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const ApprovalHistory = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()
    const { isMobile } = useResponsive()

    return (     
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <CoustomTableWithSearch 
                    searchKeyword='name'
                    page='approval'
                    url='/api/approval/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
            </div>
        </div>  
    )
}

export default ApprovalHistory