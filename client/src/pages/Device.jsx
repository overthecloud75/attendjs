import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/device'

const Device = ({ menu, setMenu }) => {
    const { isMobile } = useResponsive()

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <CustomTableWithSearch
                menu={menu}
                searchKeyword='mac'
                page='device'
                url='/api/device/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        </MainLayout>
    )
}

export default Device