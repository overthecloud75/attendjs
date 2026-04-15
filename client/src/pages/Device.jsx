import { useRef } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/device'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import CustomTableButtons from '../components/tables/CustomTableButtons'
import { Laptop } from 'lucide-react'

const Device = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const tableRef = useRef()

    const PageActions = (
        <CustomTableButtons 
            page="device"
            onWriteClick={() => tableRef.current?.handleWriteClick()}
        />
    )

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={Laptop}
                title={t('sidebar-device', '단말기 관리')}
                subtitle={t('device-subtitle', '사내 IT 자산 및 등록된 업무용 단말기를 관리합니다.')}
                extra={PageActions}
                breadcrumbs={[
                    { label: t('sidebar-admin', '관리자'), path: '#' },
                    { label: t('sidebar-device', '단말기 관리') }
                ]}
            />
            <CustomTableWithSearch
                ref={tableRef}
                searchKeyword='mac'
                page='device'
                url='/api/device/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                hideButtons={true}
                mt={2}
            />
        </Box>
    )
}

export default Device