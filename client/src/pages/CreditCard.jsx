import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/creditcard'

const CreditCard = () => {
    const { isMobile } = useResponsive()

    return (
        <CustomTableWithSearch
            searchKeyword='name'
            page='creditcard'
            columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
            csvHeaders={csvHeaders}
        />
    )
}

export default CreditCard