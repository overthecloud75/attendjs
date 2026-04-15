import { useResponsive } from '../hooks/useResponsive'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/loginHistory'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/common/PageHeader'
import { ShieldCheck } from 'lucide-react'

const LoginHistory = () => {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <PageHeader
                icon={ShieldCheck}
                title={t('sidebar-loginhistory', '로그인 기록')}
                subtitle={t('loginhistory-subtitle', '보안 강화를 위해 시스템 접속 이력을 모니터링합니다.')}
                breadcrumbs={[
                    { label: t('sidebar-admin', '관리자'), path: '#' },
                    { label: t('sidebar-loginhistory', '로그인 기록') }
                ]}
            />
            <CustomTableWithSearch
                searchKeyword='name'
                page='loginhistory'
                url='/api/auth/search'
                columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                csvHeaders={csvHeaders}
            />
        </Box>
    )
}

export default LoginHistory