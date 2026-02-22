import { useOutletContext } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/location'

const Location = (props) => {
    // Try to get props from context (if rendered via Outlet) or fallback to direct props
    const context = useOutletContext()
    const { menu, setMenu } = context || props

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
        <MainLayout menu={menu} setMenu={setMenu}>
            <CustomTableWithSearch
                menu={menu}
                searchKeyword='name'
                page='location'
                url='/api/location/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        </MainLayout>
    )
}

export default Location