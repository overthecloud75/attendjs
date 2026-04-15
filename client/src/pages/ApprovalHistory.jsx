import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/approval'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { ClipboardCheck } from 'lucide-react'

const ApprovalHistory = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={ClipboardCheck}
                title={t('sidebar-approval', '결재 신청 내역')}
                subtitle={t('approval-subtitle', '본인이 신청한 결재 내역을 관리하고 상태를 확인합니다.')}
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('sidebar-approval', '결재 신청 내역') }
                ]}
            />
            <CustomTableWithSearch
                searchKeyword='name'
                page='approval'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                rowClickable={true}
            />
        </Box>
    )
}

export default ApprovalHistory