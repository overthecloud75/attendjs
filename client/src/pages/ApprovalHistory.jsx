import { useRef } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/approval'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import CustomTableButtons from '../components/tables/CustomTableButtons'
import { ClipboardCheck } from 'lucide-react'

const ApprovalHistory = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const tableRef = useRef()

    const PageActions = (
        <CustomTableButtons 
            page="approval"
            onOpenApproval={() => tableRef.current?.openUpdate({})}
            onOpenPayment={() => tableRef.current?.openUpdate({})}
        />
    )

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={ClipboardCheck}
                title={t('sidebar-approval', '결재 신청 내역')}
                subtitle={t('approval-subtitle', '본인이 신청한 결재 내역을 관리하고 상태를 확인합니다.')}
                extra={PageActions}
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('sidebar-approval', '결재 신청 내역') }
                ]}
            />
            <CustomTableWithSearch
                ref={tableRef}
                searchKeyword='name'
                page='approval'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                rowClickable={true}
                hideButtons={true}
                mt={2}
            />
        </Box>
    )
}

export default ApprovalHistory