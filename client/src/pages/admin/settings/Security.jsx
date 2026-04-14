import React, { useState, useEffect } from 'react'
import { Box, Typography, Divider, TextField, Button, Switch, FormControlLabel, Stack, Paper, Alert, Snackbar, Grid, Card, CardContent } from '@mui/material'
import { ShieldCheck, Lock, Clock, ShieldAlert, CheckCircle, Info, Sparkles, KeyRound } from 'lucide-react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const SecuritySettings = () => {
    const { t } = useTranslation()
    const [settings, setSettings] = useState({
        passwordPolicy: { minLength: 8, requireSpecialChar: true, expiryDays: 90 },
        session: { timeoutMinutes: 60, maxLoginAttempts: 5 },
        ipAccess: { allowedIps: [], blockExternalAccess: false }
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '', open: false })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings/general')
            if (res.data?.security) {
                setSettings(res.data.security)
            }
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: '보안 설정을 불러오는데 실패했습니다.', open: true })
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await axios.put('/api/settings/general', {
                security: settings
            })
            setMessage({ type: 'success', text: '보안 설정이 성공적으로 저장되었습니다.', open: true })
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.', open: true })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', mx: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#ef444415', color: '#ef4444', borderRadius: 2 }}>
                    <ShieldCheck size={28} />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight="800" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                        Security Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        시스템 접근 보안 및 암호 정책을 구성하세요.
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                {/* Left: Configuration Form (6/12) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        {/* Password Policy */}
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <KeyRound size={18} color="#ef4444" /> Password Policy
                            </Typography>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Minimum Password Length"
                                    type="number"
                                    fullWidth size="small"
                                    value={settings.passwordPolicy.minLength}
                                    onChange={(e) => handleChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                                />
                                <TextField
                                    label="Password Expiration (Days)"
                                    type="number"
                                    fullWidth size="small"
                                    value={settings.passwordPolicy.expiryDays}
                                    onChange={(e) => handleChange('passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                                    helperText="Set to 0 for no expiration"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.passwordPolicy.requireSpecialChar}
                                            onChange={(e) => handleChange('passwordPolicy', 'requireSpecialChar', e.target.checked)}
                                            color="error"
                                        />
                                    }
                                    label="Require Special Character"
                                    sx={{ color: 'var(--text-primary)', mt: 1 }}
                                />
                            </Stack>
                        </Paper>

                        {/* Session Management */}
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <Clock size={18} color="#3b82f6" /> Session Management
                            </Typography>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Session Timeout (Minutes)"
                                    type="number"
                                    fullWidth size="small"
                                    value={settings.session.timeoutMinutes}
                                    onChange={(e) => handleChange('session', 'timeoutMinutes', parseInt(e.target.value))}
                                />
                                <TextField
                                    label="Max Login Attempts"
                                    type="number"
                                    fullWidth size="small"
                                    value={settings.session.maxLoginAttempts}
                                    onChange={(e) => handleChange('session', 'maxLoginAttempts', parseInt(e.target.value))}
                                />
                            </Stack>
                        </Paper>

                        <Box>
                            <Button
                                variant="contained" size="large" onClick={handleSave} disabled={loading}
                                startIcon={<Lock size={20} />}
                                sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700, bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
                            >
                                {loading ? 'Saving...' : '보안 설정 저장'}
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                {/* Right: Security Insight (6/12) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="var(--text-secondary)" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    <ShieldAlert size={16} /> Security Compliance
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'var(--text-primary)' }}>
                                    강력한 보안 정책은 <b>회사의 소중한 근태 및 개인 정보</b>를 보호하는 첫 번째 장벽입니다. <br />
                                    최소 8자 이상의 비밀번호 길이를 권장하며, 특수 문자 포함을 활성화하여 브루트 포스(Brute-force) 공격으로부터 계정을 보호하세요.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#ef444405', border: '1px solid #ef444420' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                <Sparkles size={18} color="#ef4444" /> Security Recommendations
                            </Typography>
                            <Typography variant="body2" color="var(--text-secondary)" sx={{ lineHeight: 1.8 }}>
                                • 세션 타임아웃을 60분 이내로 설정하여 유휴 세션 탈취를 방지하세요.<br />
                                • 로그인 실패 횟수 제한(Max Attempts)을 통해 무차별 대입 공격을 차단 중입니다.<br />
                                • 정기적인 비밀번호 만료 정책(Expiry Days)을 활성화하는 것을 권장합니다.
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
                <Alert severity={message.type === 'success' ? 'success' : 'error'} sx={{ width: '100%', borderRadius: 2 }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    )
}

export default SecuritySettings
