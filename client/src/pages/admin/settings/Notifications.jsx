import React, { useState } from 'react'
import { Box, Typography, Divider, Switch, FormControlLabel, Stack, Paper, Button, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material'
import { Bell, Mail, Smartphone, CheckCircle, Info, Sparkles, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const NotificationSettings = () => {
    const { t } = useTranslation()
    const [settings, setSettings] = useState({
        email: { enabled: true, reportDaily: true },
        push: { enabled: false, alertApprovals: true },
        system: { announceBoard: true }
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '', open: false })

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setMessage({ type: 'success', text: '알림 설정이 저장되었습니다.', open: true })
        }, 800)
    }

    const handleChange = (channel, field, value) => {
        setSettings(prev => ({
            ...prev,
            [channel]: { ...prev[channel], [field]: value }
        }))
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', mx: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#f59e0b15', color: '#f59e0b', borderRadius: 2 }}>
                    <Bell size={28} />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight="800" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                        Notification Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        직원들에게 전달될 이메일 및 푸시 알림 환경을 구성하세요.
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                {/* Left: Configuration Form (6/12) */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        {/* Email Channel */}
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" fontWeight="700" mb={3} display="flex" alignItems="center" gap={1}>
                                <Mail size={18} color="#3b82f6" /> Email Notifications
                            </Typography>
                            <Stack spacing={1}>
                                <FormControlLabel
                                    control={<Switch checked={settings.email.enabled} onChange={(e) => handleChange('email', 'enabled', e.target.checked)} />}
                                    label="이메일 알림 전체 활성화"
                                    sx={{ color: 'var(--text-primary)' }}
                                />
                                <FormControlLabel
                                    control={<Switch checked={settings.email.reportDaily} onChange={(e) => handleChange('email', 'reportDaily', e.target.checked)} />}
                                    label="일일 근태 리포트 요약 발송"
                                    sx={{ color: 'var(--text-primary)' }}
                                />
                            </Stack>
                        </Paper>

                        {/* Push Content */}
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" fontWeight="700" mb={3} display="flex" alignItems="center" gap={1}>
                                <Smartphone size={18} color="#10b981" /> App Push Notifications
                            </Typography>
                            <Stack spacing={1}>
                                <FormControlLabel
                                    control={<Switch checked={settings.push.enabled} onChange={(e) => handleChange('push', 'enabled', e.target.checked)} />}
                                    label="모바일 푸시 알림 사용"
                                    sx={{ color: 'var(--text-primary)' }}
                                />
                                <FormControlLabel
                                    control={<Switch checked={settings.push.alertApprovals} onChange={(e) => handleChange('push', 'alertApprovals', e.target.checked)} />}
                                    label="결재 요청 시 즉시 알림"
                                    sx={{ color: 'var(--text-primary)' }}
                                />
                            </Stack>
                        </Paper>

                        <Box>
                            <Button
                                variant="contained" size="large" onClick={handleSave} disabled={loading}
                                startIcon={<CheckCircle size={20} />}
                                sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                            >
                                {loading ? '저장 중...' : '알림 설정 저장'}
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                {/* Right: Insight (6/12) */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="var(--text-secondary)" mb={2} display="flex" alignItems="center" gap={1}>
                                    <MessageSquare size={16} /> Communication Policy
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'var(--text-primary)' }}>
                                    과도한 알림은 직원들의 <b>업무 집중도</b>를 떨어뜨릴 수 있습니다. <br />
                                    중요한 결재 요청이나 공지사항은 푸시 알림으로, 정기적인 근태 보고서는 이메일 요약으로 전달하는 채널 전략을 권장합니다.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f59e0b05', border: '1px solid #f59e0b20' }}>
                            <Typography variant="subtitle2" fontWeight="700" mb={1.5} display="flex" alignItems="center" gap={1}>
                                <Sparkles size={18} color="#f59e0b" /> Notification Intelligence
                            </Typography>
                            <Typography variant="body2" color="var(--text-secondary)" sx={{ lineHeight: 1.8 }}>
                                • AI 에이전트가 알림 내용의 중요도를 판별하여 자동 요약합니다.<br />
                                • 밤 10시 이후 알림 금지(Do-Not-Disturb) 모드가 기본 적용됩니다.<br />
                                • 수신 거부 설정 시에도 긴급 공지(Emergency)는 발송됩니다.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>

            <Snackbar
                open={message.open} autoHideDuration={4000}
                onClose={() => setMessage({ ...message, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    )
}

export default NotificationSettings
