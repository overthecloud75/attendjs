import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/attend'

const Attend = () => {
    const { isMobile } = useResponsive()

    return (
        <CustomTableWithSearch
            searchKeyword='name'
            page='attend'
            url='/api/attend/search'
            columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
            csvHeaders={csvHeaders}
        />
    )
}

export default Attend