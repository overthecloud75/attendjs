import { useRef, useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { 
    columnHeaders, 
    mobileColumnHeaders, 
    csvHeaders,
    attendUpdateColumnHeaders,
    paymentUpdateColumnHeaders
} from '../configs/approval'
import { Box, Tabs, Tab, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import CustomTableButtons from '../components/tables/CustomTableButtons'
import { ClipboardCheck, FileText, Calendar, Wallet } from 'lucide-react'

const ApprovalHistory = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const tableRef = useRef()
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const PageActions = (
        <CustomTableButtons 
            page="approval"
            showApproval={tabValue === 0 || tabValue === 1}
            showPayment={tabValue === 0 || tabValue === 2}
            showScan={tabValue === 2} // Expense tab only for now
            onOpenApproval={() => tableRef.current?.openUpdate({})}
            onOpenPayment={() => tableRef.current?.openUpdate({})}
            onOpenScan={() => alert('AI 영수증 스캔 기능을 준비 중입니다. (Gemma 4 26B 연동 예정)')}
        />
    )

    // Determine columns and params based on active tab
    const getTabConfig = () => {
        switch (tabValue) {
            case 1: // Attendance
                return {
                    columns: attendUpdateColumnHeaders,
                    params: { approvalType: 'attend' }
                }
            case 2: // Payment
                return {
                    columns: paymentUpdateColumnHeaders,
                    params: { approvalType: 'payment' }
                }
            default: // All
                return {
                    columns: isMobile ? mobileColumnHeaders : columnHeaders,
                    params: {}
                }
        }
    }

    const { columns, params } = getTabConfig()

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

            <Paper 
                elevation={0} 
                sx={{ 
                    mt: 3, 
                    borderRadius: 3, 
                    border: '1px solid var(--border-color)',
                    bgcolor: 'var(--card-bg)',
                    overflow: 'hidden'
                }}
            >
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant={isMobile ? "fullWidth" : "standard"}
                    sx={{
                        px: 2,
                        pt: 1,
                        borderBottom: '1px solid var(--border-color)',
                        '& .MuiTab-root': {
                            minHeight: 50,
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            '&.Mui-selected': {
                                color: '#3b82f6',
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#3b82f6',
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    <Tab 
                        icon={<FileText size={18} />} 
                        iconPosition="start" 
                        label={t('approval-tab-all', '전체 결재')} 
                    />
                    <Tab 
                        icon={<Calendar size={18} />} 
                        iconPosition="start" 
                        label={t('approval-tab-attend', '근태 신청')} 
                    />
                    <Tab 
                        icon={<Wallet size={18} />} 
                        iconPosition="start" 
                        label={t('approval-tab-payment', '지출 결의')} 
                    />
                </Tabs>

                <CustomTableWithSearch
                    ref={tableRef}
                    searchKeyword='name'
                    page='approval'
                    columnHeaders={columns}
                    csvHeaders={csvHeaders}
                    extraParams={params}
                    rowClickable={true}
                    hideButtons={true}
                    mt={0}
                />
            </Paper>
        </Box>
    )
}

export default ApprovalHistory