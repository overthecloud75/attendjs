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
                    {i18n.language === 'en' ? 'AGENT SQUAD' : '에이전트 스쿼드 유닛'}
                </Typography>
                <IconButton size="small" onClick={() => setShowRightPanel(false)} sx={{ opacity: 0.5, color: 'var(--text-primary)' }}>
                    <PanelRightClose size={18} />
                </IconButton>
            </Box>

            <Box sx={{ p: 2.5 }}>
                {/* 1. Squad Units */}
                <Stack spacing={2} mb={3}>
                    {/* Main Orchestrator */}
                    <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid #3b82f630', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.05)' }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1, justifyContent: 'space-between', width: '100%' }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                <Box sx={{ p: 0.8, bgcolor: '#3b82f615', color: '#3b82f6', borderRadius: 2 }}>
                                    <Layers size={16} />
                                </Box>
                                <Typography variant="body2" fontWeight="700">Main Orchestrator</Typography>
                            </Stack>
                            <Chip label="ONLINE" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#10b98120', color: '#10b981', fontWeight: 900 }} />
                        </Stack>
                        <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block', lineHeight: 1.4, mb: 1.5 }}>
                            {i18n.language === 'en' 
                                ? 'Strategic reasoning and expert delegation hub for Smartwork.'
                                : '스마트워크 시스템을 위한 전략적 추론 및 전문가 위임 허브'}
                        </Typography>
                        <Stack spacing={0.5} sx={{ pl: 0.5 }}>
                            <Typography variant="caption" fontWeight="900" sx={{ opacity: 0.4, fontSize: '0.6rem', mb: 0.5, letterSpacing: '1px' }}>
                                {i18n.language === 'en' ? 'SYSTEM CAPABILITIES' : '시스템 핵심 역량'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, fontWeight: 600 }}>
                                <History size={10} /> {i18n.language === 'en' ? 'Specialist Delegation' : '전문가 위임 및 오케스트레이션'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, fontWeight: 600 }}>
                                <Lightbulb size={10} /> {i18n.language === 'en' ? 'High-Fidelity Synthesis' : '고신뢰 지능형 답변 합성'}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* HR Specialist */}
                    <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid #f59e0b30' }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1, justifyContent: 'space-between', width: '100%' }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                <Box sx={{ p: 0.8, bgcolor: '#f59e0b15', color: '#f59e0b', borderRadius: 2 }}>
                                    <Users size={16} />
                                </Box>
                                <Typography variant="body2" fontWeight="700">HR Specialist</Typography>
                            </Stack>
                            <Chip label="ACTIVE" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#10b98120', color: '#10b981', fontWeight: 900 }} />
                        </Stack>
                        <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block', lineHeight: 1.4, mb: 1.5 }}>
                            {i18n.language === 'en' ? 'Expert in leave policies and approval procedures.' : '연차 제도 및 결재 정책 전문가'}
                        </Typography>
                        <Stack spacing={0.5} sx={{ pl: 0.5 }}>
                            <Typography variant="caption" fontWeight="900" sx={{ opacity: 0.4, fontSize: '0.6rem', mb: 0.5, letterSpacing: '1px' }}>
                                {i18n.language === 'en' ? 'CAPABILITIES' : '보유 기술'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, fontWeight: 600 }}>
                                <Zap size={10} /> {i18n.language === 'en' ? 'Leave Balance Check' : '연차 잔여량 정산'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, fontWeight: 600 }}>
                                <Calendar size={10} /> {i18n.language === 'en' ? 'Leave Request' : '연차 상신 및 승인'}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Attendance Analyst */}
                    <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid #10b98130' }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1, justifyContent: 'space-between', width: '100%' }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                <Box sx={{ p: 0.8, bgcolor: '#10b98115', color: '#10b981', borderRadius: 2 }}>
                                    <TrendingUp size={16} />
                                </Box>
                                <Typography variant="body2" fontWeight="700">Attendance Analyst</Typography>
                            </Stack>
                            <Chip label="ACTIVE" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#10b98120', color: '#10b981', fontWeight: 900 }} />
                        </Stack>
                        <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block', lineHeight: 1.4, mb: 1.5 }}>
                            {i18n.language === 'en' ? 'Specialist in work hours and attendance patterns.' : '출퇴근 기록 및 근무 시간 분석 전문가'}
                        </Typography>
                        <Stack spacing={0.5} sx={{ pl: 0.5 }}>
                            <Typography variant="caption" fontWeight="900" sx={{ opacity: 0.4, fontSize: '0.6rem', mb: 0.5, letterSpacing: '1px' }}>
                                {i18n.language === 'en' ? 'CAPABILITIES' : '보유 기술'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, fontWeight: 600 }}>
                                <History size={10} /> {i18n.language === 'en' ? 'Work History Analysis' : '업무 시간 및 근태 기록 분석'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, fontWeight: 600 }}>
                                <Bot size={10} /> {i18n.language === 'en' ? 'Real-time Clock Insight' : '지능형 근태 분석 리포트'}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>

                {/* 2. Recent History */}
                <Typography variant="subtitle2" fontWeight="700" sx={{ letterSpacing: '1px', mb: 2, mt: 4, opacity: 0.6 }}>
                    {i18n.language === 'en' ? 'RECENT HISTORY' : '최근 분석 히스토리'}
                </Typography>
                <Stack spacing={1}>
                    {history.length > 0 ? history.slice(0, 3).map((h, i) => (
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
