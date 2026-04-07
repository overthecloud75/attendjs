import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/gps'

const GPS = () => {
    const { isMobile } = useResponsive()

    return (
        <CustomTableWithSearch
            searchKeyword='name'
            page='gps'
            columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
            csvHeaders={csvHeaders}
        />
    )
}

export default GPS