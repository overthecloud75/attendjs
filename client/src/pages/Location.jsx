import { useRef } from 'react'
import { Box, Paper } from '@mui/material'
import { MapPin } from 'lucide-react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/location'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import CustomTableButtons from '../components/tables/CustomTableButtons'

const Location = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const tableRef = useRef()

    const PageActions = (
        <CustomTableButtons 
            page="location"
            onWriteClick={() => tableRef.current?.handleWriteClick()}
        />
    )

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={MapPin}
                color="#8b5cf6"
                title={t('sidebar-location', '출근 위치 설정')}
                subtitle={t('location-subtitle', '출퇴근 허용 위치(GPS, Wifi) 및 범위를 정밀하게 관리하세요.')}
                extra={PageActions}
                breadcrumbs={[
                    { label: t('sidebar-admin', '관리자'), path: '#' },
                    { label: t('sidebar-location', '출근 위치 설정') }
                ]}
            />
            <Paper sx={{ mt: 2, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)' }} elevation={0}>
                <CustomTableWithSearch
                    ref={tableRef}
                    searchKeyword='name'
                    page='location'
                    url='/api/location/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                    hideButtons={true}
                />
            </Paper>
        </Box>
    )
}

export default Location