import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/gps'

const GPS = ({ menu, setMenu }) => {
    const { isMobile } = useResponsive()

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <CustomTableWithSearch
                menu={menu}
                searchKeyword='name'
                page='gps-attend'
                url='/api/gps-attend/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        </MainLayout>
    )
}

export default GPS