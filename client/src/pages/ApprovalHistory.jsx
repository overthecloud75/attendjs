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
import { Box, Tabs, Tab, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import ReceiptScanner from '../components/expense/ReceiptScanner'
import { ScanText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import CustomTableButtons from '../components/tables/CustomTableButtons'
import { ClipboardCheck, FileText, Calendar, Wallet } from 'lucide-react'

const ApprovalHistory = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const tableRef = useRef()
    const [tabValue, setTabValue] = useState(0)
    const [scanOpen, setScanOpen] = useState(false)

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
            onOpenScan={() => setScanOpen(true)}
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

            {/* Smart Receipt Scan Dialog */}
            <Dialog 
                open={scanOpen} 
                onClose={() => setScanOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: { sx: { borderRadius: 4, bgcolor: 'var(--card-bg)', color: 'var(--text-primary)' } }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
                    <Box sx={{ p: 1, bgcolor: 'var(--bg-active)', borderRadius: '50%', color: 'var(--text-active)', display: 'flex' }}>
                        <ScanText size={22} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" component="span">스마트 영수증 정산</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        AI가 영수증을 분석하고 법인카드 내역과 대조하여 지출 결재안을 작성합니다.
                    </Typography>
                    <ReceiptScanner onComplete={(data) => console.log('Scan Data:', data)} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setScanOpen(false)} sx={{ color: 'var(--text-secondary)' }}>닫기</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ApprovalHistory