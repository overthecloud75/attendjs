import React from 'react'
import { Box, Typography, Divider, Paper } from '@mui/material'
import { MapPin, Globe, ShieldCheck } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import MainLayout from '../components/layout/MainLayout'
import CustomTableWithSearch from '../components/tables/CustomTableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/location'

const Location = (props) => {
    const context = useOutletContext()
    const { menu, setMenu } = context || props
    const { isMobile } = useResponsive()

    const renderHeader = () => (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: '#8b5cf615', color: '#8b5cf6', borderRadius: 2 }}>
                <MapPin size={28} />
            </Box>
            <Box>
                <Typography variant="h5" fontWeight="800" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                    Location Settings
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    출퇴근 허용 위치(GPS, Wifi) 및 범위를 정밀하게 관리하세요.
                </Typography>
            </Box>
        </Box>
    )

    const renderContent = () => (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', mx: 0 }}>
            {renderHeader()}
            <Divider sx={{ mb: 4 }} />
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)' }} elevation={0}>
                <CustomTableWithSearch
                    menu={menu}
                    searchKeyword='name'
                    page='location'
                    url='/api/location/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
            </Paper>
        </Box>
    )

    if (context) {
        return renderContent()
    }

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            {renderContent()}
        </MainLayout>
    )
}

export default Location