import { useOutletContext } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/location'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const Location = (props) => {
    // Try to get props from context (if rendered via Outlet) or fallback to direct props
    const context = useOutletContext()
    const { menu, setMenu } = context || props

    useRedirectIfNotAuthenticated()
    const { isMobile } = useResponsive()

    if (context) {
        return (
            <CustomTableWithSearch
                menu={menu}
                searchKeyword='name'
                page='location'
                url='/api/location/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        )
    }

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu} />}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu} />
                <CustomTableWithSearch
                    menu={menu}
                    searchKeyword='name'
                    page='location'
                    url='/api/location/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
            </div>
        </div>
    )
}

export default Location