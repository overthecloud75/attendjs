import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/wifi'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { Wifi as WifiIcon } from 'lucide-react'

const Wifi = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={WifiIcon}
                title={t('sidebar-wifi', 'Wifi 연결 정보')}
                subtitle={t('wifi-subtitle', '사내 Wifi망을 통한 출퇴근 인증 위치를 관리합니다.')}
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('sidebar-wifi', 'Wifi 연결 정보') }
                ]}
            />
            <CustomTableWithSearch
                searchKeyword='mac'
                page='wifi'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                hideButtons={true}
                mt={2}
            />
        </Box>
    )
}

export default Wifi