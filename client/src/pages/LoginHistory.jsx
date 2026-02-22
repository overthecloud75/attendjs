import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/loginHistory'

const LoginHistory = ({ menu, setMenu }) => {
    const { isMobile } = useResponsive()

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <CustomTableWithSearch
                menu={menu}
                searchKeyword='name'
                page='loginhistory'
                url='/api/auth/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        </MainLayout>
    )
}

export default LoginHistory