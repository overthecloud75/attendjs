import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/approval'

const ApprovalHistory = () => {
    const { isMobile } = useResponsive()

    return (
        <CustomTableWithSearch
            searchKeyword='name'
            page='approvalhistory'
            url='/api/approval/history'
            columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
            csvHeaders={csvHeaders}
        />
    )
}

export default ApprovalHistory