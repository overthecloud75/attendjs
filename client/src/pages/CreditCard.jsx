import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/creditcard'

const CreditCard = () => {
    const { isMobile } = useResponsive()

    return (
        <CustomTableWithSearch
            searchKeyword='name'
            page='creditcard'
            url='/api/creditcard/search'
            columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
            csvHeaders={csvHeaders}
        />
    )
}

export default CreditCard