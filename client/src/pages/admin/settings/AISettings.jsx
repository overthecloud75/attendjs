import React, { useState, useEffect } from 'react'
import { Box, Typography, Divider, TextField, Button, Stack, Paper, Alert, Snackbar, InputAdornment, IconButton, CircularProgress, Card, CardContent, Grid, LinearProgress } from '@mui/material'
import { Eye, EyeOff, Bot, Sparkles, Zap, CheckCircle, AlertCircle, RefreshCw, Key, Globe, ExternalLink, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const AISettings = () => {
    const { t } = useTranslation()
    const [settings, setSettings] = useState({
        apiKey: '',
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-4o',
        temperature: 0.7
    })
    const [showKey, setShowKey] = useState(false)
    const [loading, setLoading] = useState(false)
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState({ success: null, message: '' })
    const [message, setMessage] = useState({ type: '', text: '', open: false })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/settings/general')
            if (res.data && res.data.llm) {
                setSettings({
                    apiKey: res.data.llm.apiKey || '',
                    baseURL: res.data.llm.baseURL || 'https://api.openai.com/v1',
                    model: res.data.llm.model || 'gpt-4o',
                    temperature: res.data.llm.temperature || 0.7
                })
            }
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다.', open: true })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await axios.put('/api/settings/general', {
                llm: settings
            })
            setMessage({ type: 'success', text: 'AI 설정이 성공적으로 저장되었습니다.', open: true })
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.', open: true })
        } finally {
            setLoading(false)
        }
    }

    const handleTestConnection = async () => {
        setTesting(true)
        setTestResult({ success: null, message: '' })
        try {
            const res = await axios.post('/api/settings/test-llm', settings)
            if (res.data.success) {
                setTestResult({ success: true, message: '연결 성공! API와 정상적으로 통신합니다.' })
            } else {
                setTestResult({ success: false, message: res.data.message || '연결 실패' })
            }
        } catch (err) {
            setTestResult({ success: false, message: '연결에 실패했습니다. 설정을 확인하세요.' })
        } finally {
            setTesting(false)
        }
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', mx: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#3b82f615', color: '#3b82f6', borderRadius: 2 }}>
                    <ShieldCheck size={28} />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight="800" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                        AI & Agentic Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        Agentic Canvas의 성능과 보안을 관리하세요.
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                {/* Left: Configuration Form (6/12) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <Globe size={18} color="#3b82f6" /> API Endpoint
                            </Typography>
                            <TextField
                                fullWidth label="Base URL" placeholder="https://api.openai.com/v1"
                                variant="outlined" value={settings.baseURL}
                                onChange={(e) => setSettings({ ...settings, baseURL: e.target.value })}
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                fullWidth label="Model ID" placeholder="gpt-4o"
                                variant="outlined" value={settings.model}
                                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                            />
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <Key size={18} color="#f59e0b" /> Security Credentials
                            </Typography>
                            <TextField
                                fullWidth label="API Key" type={showKey ? 'text' : 'password'}
                                value={settings.apiKey} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowKey(!showKey)}><Eye size={18} /></IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Paper>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained" size="large" onClick={handleSave} disabled={loading}
                                sx={{ px: 4, borderRadius: 3, fontWeight: 700, bgcolor: '#3b82f6' }}
                            >
                                {loading ? '저장 중...' : '설정 저장'}
                            </Button>
                            <Button
                                variant="outlined" size="large" onClick={handleTestConnection} disabled={testing}
                                sx={{ px: 4, borderRadius: 3, fontWeight: 700 }}
                            >
                                {testing ? '연결 확인 중...' : '연결 테스트'}
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                {/* Right: Detailed Status & Tips (6/12) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 4, border: `1px solid ${testResult.success ? '#10b98130' : 'var(--border-color)'}`, bgcolor: 'var(--card-bg)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="var(--text-secondary)" mb={2}>
                                    Network Diagnostics
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" fontWeight={600}>Connection Health</Typography>
                                    <Box sx={{ px: 1.5, py: 0.5, bgcolor: testResult.success ? '#10b98115' : '#6b728015', color: testResult.success ? '#10b981' : '#6b7280', borderRadius: 2, fontSize: '0.75rem', fontWeight: 800 }}>
                                        {testResult.success ? 'ONLINE' : 'UNCHECKED'}
                                    </Box>
                                </Box>
                                <LinearProgress variant="determinate" value={testResult.success ? 100 : 0} color={testResult.success ? "success" : "inherit"} sx={{ height: 6, borderRadius: 3, mb: 1 }} />
                                {testResult.message && (
                                    <Alert severity={testResult.success ? "success" : "error"} variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
                                        {testResult.message}
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#3b82f605', border: '1px solid #3b82f620' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                <Sparkles size={18} color="#3b82f6" /> Strategic Guidance
                            </Typography>
                            <Typography variant="body2" color="var(--text-secondary)" sx={{ lineHeight: 1.8 }}>
                                • <b>LLM Endpoints</b>: OpenAI 규격을 준수하는 모든 백엔드와 호환됩니다.<br />
                                • <b>Latency Tip</b>: 지연 시간을 줄이려면 물리적으로 가까운 리전의 서버 주소를 입력하세요.<br />
                                • <b>Security</b>: 저장된 API Key는 런타임 환경에서 암호화되어 관리됩니다.
                            </Typography>
                            <Button endIcon={<ExternalLink size={14} />} sx={{ mt: 1, fontSize: '0.75rem', p: 0 }}>문서 보기</Button>
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

export default AISettings
