import { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import LeaveHistoryModal from '../components/modals/LeaveHistoryModal'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/summary'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { FileText } from 'lucide-react'

const Summary = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    const [openModal, setOpenModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const handleIdClick = (employee) => {
        setSelectedEmployee(employee)
        setOpenModal(true)
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={FileText}
                title={t('summary-title', '연차 내역 요약')}
                subtitle={t('summary-subtitle', '전 사원 혹은 본인의 잔여 연차 및 현황을 한눈에 파악합니다.')}
                breadcrumbs={[
                    { label: t('sidebar-common', '공통'), path: '#' },
                    { label: t('summary-title', '연차 내역 요약') }
                ]}
            />
            <CustomTableWithSearch
                searchKeyword='name'
                page='summary'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
                onIdClick={handleIdClick}
                hideButtons={true}
                mt={2}
            />
            <LeaveHistoryModal
                open={openModal}
                setOpen={setOpenModal}
                employee={selectedEmployee}
            />
        </Box>
    )
}

export default Summary