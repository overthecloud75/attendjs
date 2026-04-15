import { useState, useRef } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/employee'

import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import CustomTableButtons from '../components/tables/CustomTableButtons'
import { Users } from 'lucide-react'

const Employee = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const tableRef = useRef()

    const PageActions = (
        <CustomTableButtons 
            page="employee"
            onWriteClick={() => tableRef.current?.handleWriteClick()}
        />
    )

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={Users}
                title={t('sidebar-employee', '직원 관리')}
                subtitle={t('employee-subtitle', '사내 구성원의 정보를 등록하고 편집합니다.')}
                extra={PageActions}
                breadcrumbs={[
                    { label: t('sidebar-admin', '관리자'), path: '#' },
                    { label: t('sidebar-employee', '직원 관리') }
                ]}
            />
            <CustomTableWithSearch
                ref={tableRef}
                searchKeyword='name'
                page='employee'
                url='/api/employee/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                hideButtons={true}
                mt={2}
            />
        </Box>
    )
}

export default Employee