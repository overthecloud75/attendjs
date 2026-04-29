import React from 'react'
import { Box, Typography, Stack, IconButton, Chip, Divider, Tooltip } from '@mui/material'
import { PanelRightClose, Layers, Users, TrendingUp, History, Zap, Calendar, Bot, MessageSquare, Trash2, UserCircle, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const AgentSidebar = ({ 
    showRightPanel, 
    setShowRightPanel, 
    history, 
    handleDeleteHistory, 
    setActivities, 
    setCommand,
    formatDateTime
}) => {
    const { i18n } = useTranslation()

    return (
        <Box sx={{ 
            width: showRightPanel ? 320 : 0,
            minWidth: showRightPanel ? 320 : 0,
            height: '100%',
            bgcolor: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-color)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            overflowY: 'auto',
            display: { xs: showRightPanel ? 'flex' : 'none', md: 'flex' },
            flexDirection: 'column',
            position: { xs: 'absolute', md: 'relative' },
            right: 0,
            zIndex: 1000,
            boxShadow: { xs: '-10px 0 20px rgba(0,0,0,0.1)', md: 'none' }
        }}>
            {/* Sidebar Header */}
            <Box sx={{ p: 2.5, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight="700" sx={{ letterSpacing: '1px', color: 'var(--text-primary)' }}>
                    {i18n.language === 'en' ? 'ANALYSIS HISTORY' : '최근 분석 히스토리'}
                </Typography>
                <IconButton size="small" onClick={() => setShowRightPanel(false)} sx={{ opacity: 0.5, color: 'var(--text-primary)' }}>
                    <PanelRightClose size={18} />
                </IconButton>
            </Box>

            <Box sx={{ p: 2.5 }}>

                {/* 2. Recent History */}
                <Typography variant="subtitle2" fontWeight="700" sx={{ letterSpacing: '1px', mb: 2, mt: 4, opacity: 0.6 }}>
                    {i18n.language === 'en' ? 'RECENT HISTORY' : '최근 분석 히스토리'}
                </Typography>
                <Stack spacing={1}>
                    {history.length > 0 ? history.slice(0, 7).map((h, i) => (
                        <Box key={h._id || i} 
                            onClick={() => {
                                setActivities(prev => [{ 
                                    user: 'You', text: h.command, time: formatDateTime(h.createdAt), icon: UserCircle, type: 'user' 
                                }, { 
                                    user: 'Assistant', text: h.finalResponse, 
                                    trail: h.agentTrail, observation: h.observation, reasoning: h.reasoning,
                                    time: formatDateTime(h.createdAt), icon: Bot, type: 'assistant' 
                                }, ...prev])
                                setCommand('')
                            }}
                            sx={{ 
                                p: 1.5, borderRadius: 3, bgcolor: 'var(--bg-primary)', 
                                border: '1px solid var(--border-color)', cursor: 'pointer',
                                transition: 'all 0.2s', '&:hover': { bgcolor: 'var(--card-bg)', borderColor: '#3b82f640', transform: 'translateX(4px)' }
                            }}
                        >
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                <Box sx={{ color: '#3b82f6', opacity: 0.5 }}>
                                    <MessageSquare size={14} />
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="caption" fontWeight="700" color="var(--text-primary)" sx={{ 
                                        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                                    }}>
                                        {h.command}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.4 }}>
                                        {formatDateTime(h.createdAt)}
                                    </Typography>
                                </Box>
                                <IconButton size="small" 
                                    onClick={(e) => handleDeleteHistory(e, h._id)} 
                                    sx={{ 
                                        opacity: 0.6, 
                                        color: 'var(--text-secondary)',
                                        '&:hover': { opacity: 1, color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' } 
                                    }}
                                >
                                    <Trash2 size={12} />
                                </IconButton>
                            </Stack>
                        </Box>
                    )) : (
                        <Typography variant="caption" sx={{ opacity: 0.5, fontStyle: 'italic', pl: 1 }}>기록이 없습니다.</Typography>
                    )}
                </Stack>

                {/* System Status */}
                <Box sx={{ mt: 4, p: 2, borderRadius: 4, bgcolor: '#3b82f610', border: '1px dashed #3b82f640', textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight="700" color="#3b82f6" sx={{ display: 'block', mb: 0.5, letterSpacing: '1px' }}>
                        RE-ACT ENGINE v3.0
                    </Typography>
                    <Typography variant="caption" color="var(--text-secondary)" sx={{ fontSize: '0.65rem', display: 'block', mb: 1, fontWeight: 700 }}>
                        High-Trust Security Active
                    </Typography>
                    <Divider sx={{ mb: 1, borderColor: '#3b82f620' }} />
                    {i18n.language === 'en' ? (
                        <Typography variant="caption" sx={{ fontSize: '0.68rem', display: 'block', mt: 0.5, color: '#3b82f6', fontWeight: 900, letterSpacing: '0.5px' }}>
                            PLAN ➡️ DELEGATE ➡️ OBSERVE ➡️ SYNTHESIS
                        </Typography>
                    ) : (
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-primary)', fontWeight: 800, mt: 0.5, letterSpacing: '0.5px' }}>
                            전략 수립 ➡️ 전문가 위임 ➡️ 결과 분석 ➡️ 답변 합성
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default AgentSidebar
