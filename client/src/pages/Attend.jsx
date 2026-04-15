import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/attend'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { Clock } from 'lucide-react'

const Attend = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={Clock}
                title={t('sidebar-attend', '근태 현황')}
                subtitle={t('attend-subtitle', '실시간 출퇴근 기록 및 근무 시간 현황을 확인합니다.')}
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('sidebar-attend', '근태 현황') }
                ]}
            />
            <CustomTableWithSearch
                searchKeyword='name'
                page='attend'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                hideButtons={true}
                mt={2}
            />
        </Box>
    )
}

export default Attend