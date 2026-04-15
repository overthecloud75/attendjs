import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/gps'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { MapPin } from 'lucide-react'

const GPS = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={MapPin}
                title={t('sidebar-gps', 'GPS 위치 정보')}
                subtitle={t('gps-subtitle', '사외 근무지 및 특정 위치에서의 출퇴근 인증 위치를 관리합니다.')}
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('sidebar-gps', 'GPS 위치 정보') }
                ]}
            />
            <CustomTableWithSearch
                searchKeyword='name'
                page='gps'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                hideButtons={true}
                mt={2}
            />
        </Box>
    )
}

export default GPS