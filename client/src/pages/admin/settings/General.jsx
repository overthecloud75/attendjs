import React, { useState, useEffect } from 'react'
import { Box, Typography, Divider, TextField, Button, Chip, Stack, Paper, Alert, Snackbar, Grid, Card, CardContent } from '@mui/material'
import { Settings, Users, Layers, CheckCircle, Info, Sparkles, Plus } from 'lucide-react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const GeneralSettings = () => {
    const { t } = useTranslation()
    const [jobTitles, setJobTitles] = useState([])
    const [ranks, setRanks] = useState([])
    const [newJobTitle, setNewJobTitle] = useState('')
    const [newRank, setNewRank] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '', open: false })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings/general')
            if (res.data) {
                setJobTitles(res.data.jobTitles || [])
                setRanks(res.data.ranks || [])
            }
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다.', open: true })
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await axios.put('/api/settings/general', {
                jobTitles,
                ranks
            })
            setMessage({ type: 'success', text: '설정이 성공적으로 저장되었습니다.', open: true })
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.', open: true })
        } finally {
            setLoading(false)
        }
    }

    const handleAddJobTitle = () => {
        if (newJobTitle.trim() && !jobTitles.includes(newJobTitle.trim())) {
            setJobTitles([...jobTitles, newJobTitle.trim()])
            setNewJobTitle('')
        }
    }

    const handleAddRank = () => {
        if (newRank.trim() && !ranks.includes(newRank.trim())) {
            setRanks([...ranks, newRank.trim()])
            setNewRank('')
        }
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%', mx: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#3b82f615', color: '#3b82f6', borderRadius: 2 }}>
                    <Settings size={28} />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight="800" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                        General Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        SmartWork의 기본 직무 및 직급 체계를 관리하세요.
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                {/* Left: Configuration Form (6/12) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        {/* Job Titles */}
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <Users size={18} color="#3b82f6" /> {t('general-job-titles')}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <TextField
                                    fullWidth size="small" placeholder={t('general-placeholder-job')}
                                    value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddJobTitle()}
                                />
                                <Button variant="contained" onClick={handleAddJobTitle} sx={{ borderRadius: 2, px: 3, bgcolor: '#3b82f6' }}>
                                    <Plus size={18} />
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {jobTitles.map((title) => (
                                    <Chip 
                                        key={title} label={title} onDelete={() => setJobTitles(jobTitles.filter(t => t !== title))} 
                                        sx={{ borderRadius: 2, bgcolor: 'var(--bg-secondary)', fontWeight: 600 }} 
                                    />
                                ))}
                            </Box>
                        </Paper>

                        {/* Ranks */}
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <Layers size={18} color="#10b981" /> {t('general-ranks')}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <TextField
                                    fullWidth size="small" placeholder={t('general-placeholder-rank')}
                                    value={newRank} onChange={(e) => setNewRank(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddRank()}
                                />
                                <Button variant="contained" onClick={handleAddRank} sx={{ borderRadius: 2, px: 3, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                                    <Plus size={18} />
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {ranks.map((rank) => (
                                    <Chip 
                                        key={rank} label={rank} onDelete={() => setRanks(ranks.filter(r => r !== rank))} 
                                        sx={{ borderRadius: 2, bgcolor: 'var(--bg-secondary)', fontWeight: 600 }} 
                                    />
                                ))}
                            </Box>
                        </Paper>

                        <Box>
                            <Button
                                variant="contained" size="large" onClick={handleSave} disabled={loading}
                                startIcon={<CheckCircle size={20} />}
                                sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700, bgcolor: '#3b82f6' }}
                            >
                                {loading ? '저장 중...' : '설정 저장'}
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                {/* Right: Guidance (6/12) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="var(--text-secondary)" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    <Info size={16} /> Configuration Insight
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'var(--text-primary)' }}>
                                    이 설정은 사내의 전반적인 <b>조직도</b>와 <b>권한 관리</b>의 기초가 됩니다. <br />
                                    직무(Job Title)와 직위(Rank)를 명확히 구분하여 입력하면, 결재선 자동 생성 및 보고 체계 구축 시 에이전트가 더 정확하게 판단할 수 있습니다.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#3b82f605', border: '1px solid #3b82f620' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "700", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                <Sparkles size={18} color="#3b82f6" /> AI Readiness Tips
                            </Typography>
                            <Typography variant="body2" color="var(--text-secondary)" sx={{ lineHeight: 1.8 }}>
                                • 직무 명칭을 정규화하면 AI 에이전트의 추천 능력이 향상됩니다.<br />
                                • '팀장', '파트장' 같은 권한 명칭을 직위에 포함시키세요.<br />
                                • 변경 사항은 모든 직원의 프로필 설정에 즉시 반영됩니다.
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

export default GeneralSettings
