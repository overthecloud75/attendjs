import React, { useState } from 'react'
import { Box, Typography, Paper, TextField, IconButton, Chip, Stack, Avatar, Card, CardContent, Container, CircularProgress, Divider, Button, Tooltip, Fade } from '@mui/material'
import { Send, Sparkles, Calendar, CheckCircle, AlertTriangle, UserCircle, Bot, Zap, History, Lightbulb, TrendingUp, X, Check, PanelRightClose, PanelRightOpen, Layers, LayoutDashboard, ShieldCheck, XCircle, Users, MessageSquare, Trash2 } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// 에이전트 카드 (중앙 정렬 최적화)
const AgentStatusCard = ({ id, title, status, icon: Icon, color, onHide }) => (
    <Card sx={{ 
        width: '100%', maxWidth: 280,
        borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.1)', borderColor: color }
    }}>
        <CardContent sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: `${color}15`, color: color, borderRadius: 2 }}>
                    <Icon size={20} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="800" sx={{ opacity: 0.9 }}>{title}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" color="#10b981" fontWeight="700">{status}</Typography>
                    </Stack>
                </Box>
                <IconButton size="small" onClick={() => onHide(id)} sx={{ opacity: 0.3, '&:hover': { opacity: 1 } }}>
                    <X size={14} />
                </IconButton>
            </Stack>
        </CardContent>
    </Card>
)

const AgenticCanvas = () => {
    const { i18n } = useTranslation()
    const [command, setCommand] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [statusMsg, setStatusMsg] = useState('')
    const [showRightPanel, setShowRightPanel] = useState(window.innerWidth > 900)
    const [visibleCards, setVisibleCards] = useState(['leave', 'approval', 'sync', 'hub'])
    const [expandedInsights, setExpandedInsights] = useState({})
    const [history, setHistory] = useState([])
    const [activities, setActivities] = useState([])

    const formatDate = (dateInput) => {
        const d = new Date(dateInput)
        const y = d.getFullYear()
        const m = d.getMonth() + 1
        const dd = d.getDate()
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')
        const ss = String(d.getSeconds()).padStart(2, '0')
        return `${y}. ${m}. ${dd}. ${hh}:${mm}:${ss}`
    }

    const getNowTimestamp = () => formatDate(new Date())

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/agent/history')
            const historyData = data.history || []
            setHistory(historyData)
            
            // Rehydrate the activities feed with the MOST RECENT history as well
            if (historyData.length > 0 && activities.length === 0) {
                const recentActivities = historyData.slice(0, 3).flatMap(h => [
                    { 
                        user: 'You', text: h.command, time: formatDate(h.createdAt), icon: UserCircle, type: 'user' 
                    },
                    { 
                        user: 'Assistant', text: h.finalResponse, 
                        trail: h.agentTrail, observation: h.observation, reasoning: h.reasoning,
                        time: formatDate(h.createdAt), icon: Bot, type: 'assistant' 
                    }
                ])
                setActivities(prev => [...recentActivities, ...prev])
            }
        } catch (err) {
            console.error('Failed to fetch agent history:', err)
        }
    }

    React.useEffect(() => {
        fetchHistory()
    }, [])

    const handleDeleteHistory = async (e, id) => {
        e.stopPropagation()
        try {
            const csrfToken = axios.defaults.headers.common['X-CSRF-Token'] || axios.defaults.headers.post?.['X-CSRF-Token'] || '';
            await axios.delete(`/api/agent/history/${id}`, {
                headers: { 'X-CSRF-Token': csrfToken }
            })
            setHistory(prev => prev.filter(h => h._id !== id))
        } catch (err) {
            console.error('Failed to delete history:', err)
        }
    }

    const SUGGESTIONS = [
        { label: '남은 연차 확인', cmd: '남은 연차 확인해줘' },
        { label: '내일 연차 신청', cmd: '내일 연차 신청할게' },
        { label: '지난달 근무 분석', cmd: '지난달 근무 시간 분석해줘' },
        { label: '출퇴근 기록 확인', cmd: '최근 일주일 출퇴근 기록 보여줘' },
        { label: '휴가 정책 문의', cmd: '연차 신청 정책 알려줘' }
    ]

    const handleSendCommand = async (overrideCmd = null) => {
        const userCommand = overrideCmd || command
        if (!userCommand.trim() || isLoading) return
        
        const currentTimestamp = getNowTimestamp()
        
        // 1. Add User's Question to Feed immediately
        setActivities(prev => [{ 
            user: 'You', 
            text: userCommand, 
            time: currentTimestamp, 
            icon: UserCircle,
            type: 'user'
        }, ...prev])

        setCommand('')
        
        // --- START BILINGUAL REASONING PULSE ---
        setIsLoading(true)
        const isEnglish = /[a-zA-Z]/.test(userCommand) && !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(userCommand)
        
        const statusSteps = isEnglish 
            ? [
                'Analyzing intent...', 
                'Formulating execution plan...', 
                'Searching for optimal agent path...', 
                'Delegating to Specialist...', 
                'Synthesizing final response...'
              ]
            : [
                '사용자 의도 분석 중...', 
                '실행 전략 및 계획 수립 중...', 
                '최적 에이전트 경로 검색 중...', 
                '전문가 유닛 위임 로직 가동...', 
                '데이터 취합 및 답변 합성 중...'
              ]
        
        let stepIdx = 0
        const pulseInterval = setInterval(() => {
            setStatusMsg(statusSteps[stepIdx % statusSteps.length])
            stepIdx++
        }, 1200)

        try {
            // Increase timeout to 10 minutes (600,000ms) to support heavy reasoning (397B)
            const { data } = await axios.post('/api/agent/command', { command: userCommand }, { timeout: 600000 })
            const result = data.response
            
            // Handle Action Required (HITL)
            const isAction = result && typeof result === 'object' && result.type === 'ACTION_REQUIRED'
            const displayText = isAction ? result.message : (result?.content || result || (isEnglish ? 'Unknown response.' : '알 수 없는 응답입니다.'))

            // 2. Add Assistant's Response to Feed (Place it right AFTER the new User Command which is at index 0)
            setActivities(prev => {
                const newActivities = [...prev]
                newActivities.splice(1, 0, { 
                    user: 'Assistant', 
                    text: displayText, 
                    trail: result?.trail || [],
                    observation: result?.observation || null,
                    reasoning: result?.reasoning || null,
                    time: getNowTimestamp(), 
                    icon: isAction ? ShieldCheck : Bot,
                    type: 'assistant',
                    actionRequired: isAction ? result : null
                })
                return newActivities
            })
            
            // Refresh history after success
            fetchHistory()
        } catch (error) {
            console.error('Orchestration error:', error)
            // Display high-fidelity error message from server (e.g., TOOLS_NOT_SUPPORTED)
            const serverMsg = error.response?.data?.message || (isEnglish ? 'Communication error with services.' : '서비스와 통신 중 응답이 없거나 오류가 발생했습니다.')
            
            setActivities(prev => [{ 
                user: 'System', 
                text: serverMsg, 
                time: getNowTimestamp(), 
                icon: AlertTriangle,
                type: 'system'
            }, ...prev])
        } finally {
            clearInterval(pulseInterval)
            setIsLoading(false)
            setStatusMsg('')
        }
    }

    const handleConfirmAction = async (action, isConfirmed) => {
        if (!isConfirmed) {
            setActivities(prev => [{ 
                user: 'System', text: '명령이 취소되었습니다.', time: getNowTimestamp(), icon: XCircle, type: 'system' 
            }, ...prev])
            return
        }

        setIsLoading(true)
        try {
            const { data } = await axios.post('/api/agent/command', { 
                isConfirmed: true, 
                pendingAction: action 
            })
            setActivities(prev => {
                const newActivities = [...prev]
                newActivities.splice(1, 0, { 
                    user: 'Assistant', text: data.response, time: getNowTimestamp(), icon: CheckCircle, type: 'assistant' 
                })
                return newActivities
            })
        } catch (error) {
            console.error('Action failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const hideCard = (id) => {
        setVisibleCards(prev => prev.filter(cardId => cardId !== id))
    }

    const toggleInsight = (idx) => {
        setExpandedInsights(prev => ({ ...prev, [idx]: !prev[idx] }))
    }

    return (
        <Box sx={{ display: 'flex', height: '100%', bgcolor: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
                
                {/* 1. Main Interaction Area */}
                <Box sx={{ 
                    flex: 1, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                }}>
                    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 3 }, flex: 1, position: 'relative' }}>
                        {/* Header Area */}
                        <Box mb={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 1, bgcolor: '#3b82f615', color: '#3b82f6', borderRadius: 2.5 }}>
                                    <Layers size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight="900" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                                        Agentic Canvas
                                    </Typography>
                                    <Typography variant="body2" color="var(--text-secondary)" sx={{ opacity: 0.7 }}>
                                        Intelligent Assistant Orchestration
                                    </Typography>
                                </Box>
                            </Box>
                            
                            {/* Toggle Button */}
                            {!showRightPanel && (
                                <Tooltip title="사이드 패널 열기">
                                    <IconButton 
                                        onClick={() => setShowRightPanel(true)}
                                        sx={{ 
                                            bgcolor: '#3b82f615', color: '#3b82f6', 
                                            border: '1px solid #3b82f630',
                                            '&:hover': { bgcolor: '#3b82f625' }
                                        }}
                                    >
                                        <PanelRightOpen size={20} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>

                        <Stack spacing={4}>
                            <Box>
                                <Stack direction="row" spacing={1} mb={1.5} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                                    {SUGGESTIONS.map((s, i) => (
                                        <Chip 
                                            key={i} label={s.label} clickable 
                                            onClick={() => handleSendCommand(s.cmd)}
                                            icon={<Sparkles size={14} />}
                                            sx={{ 
                                                borderRadius: '12px', bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                                                fontWeight: 800, fontSize: '0.8rem', px: 1, py: 2,
                                                color: 'var(--text-primary)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                '&:hover': { bgcolor: 'var(--bg-active)', borderColor: 'var(--text-active)', transform: 'translateY(-1px)' },
                                                '& .MuiChip-icon': { color: 'var(--text-active)' }
                                            }}
                                        />
                                    ))}
                                </Stack>
                                
                                {isLoading && statusMsg && (
                                    <Fade in={true}>
                                        <Stack direction="row" spacing={1} alignItems="center" mb={1} sx={{ pl: 2 }}>
                                            <CircularProgress size={12} sx={{ color: '#3b82f6' }} />
                                            <Typography variant="caption" fontWeight="800" color="#3b82f6" sx={{ letterSpacing: '0.5px' }}>
                                                {statusMsg}
                                            </Typography>
                                        </Stack>
                                    </Fade>
                                )}

                                <Paper sx={{ 
                                    p: 1.5, borderRadius: 6, bgcolor: 'var(--card-bg)', border: '2px solid #3b82f6',
                                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
                                }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: '#3b82f6', width: 44, height: 44 }}>
                                            {isLoading ? <CircularProgress size={24} color="inherit" /> : <Bot size={24} />}
                                        </Avatar>
                                        <TextField
                                            fullWidth placeholder="명령어를 입력하세요..." variant="standard"
                                            value={command} onChange={(e) => setCommand(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                                            disabled={isLoading} InputProps={{ disableUnderline: true }}
                                            sx={{ '& input': { fontSize: '1.2rem', fontWeight: 700 } }}
                                        />
                                        <IconButton 
                                            onClick={handleSendCommand} disabled={isLoading || !command.trim()}
                                            sx={{ 
                                                width: 44, height: 44, 
                                                bgcolor: '#3b82f6', 
                                                color: '#ffffff !important',
                                                '&:hover': { bgcolor: '#2563eb', transform: 'scale(1.05)' },
                                                '&.Mui-disabled': { bgcolor: 'var(--hover-bg)', color: 'var(--text-secondary)' },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Send size={22} />
                                        </IconButton>
                                    </Stack>
                                </Paper>
                            </Box>

                            <Box sx={{ pb: 10 }}>
                                <Typography variant="subtitle2" fontWeight="800" mb={2} sx={{ opacity: 0.6, letterSpacing: '1px' }}>
                                    {i18n.language === 'en' ? 'EXPERIENCE FEED' : '실시간 에이전트 활동 피드'}
                                </Typography>
                                <Stack spacing={2.5}>
                                    {activities.map((item, idx) => (
                                        <Fade in={true} key={idx} timeout={500 + (idx * 200)}>
                                            <Paper variant="outlined" sx={{ 
                                                p: 1.5, borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'var(--bg-secondary)',
                                                transition: 'all 0.3s', '&:hover': { bgcolor: 'var(--card-bg)', borderColor: '#3b82f640' }
                                            }}>
                                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                                    <Box sx={{ p: 0.8, bgcolor: 'var(--bg-primary)', borderRadius: 2, color: item.type === 'user' ? '#f59e0b' : '#3b82f6' }}>
                                                        <item.icon size={18} />
                                                    </Box>
                                                    <Box flex={1} sx={{ 
                                                        '& p': { m: 0 }, 
                                                        '& table': { borderCollapse: 'collapse', width: '100%', my: 2, border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' },
                                                        '& th, & td': { border: '1px solid var(--border-color)', p: 1, textAlign: 'left', fontSize: '0.75rem' },
                                                        '& th': { bgcolor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 800 },
                                                        '& td': { color: 'var(--text-secondary)' },
                                                        '& ul, & ol': { pl: 2, my: 1 },
                                                        '& code': { bgcolor: 'var(--bg-secondary)', color: '#ef4444', p: '2px 4px', borderRadius: '4px', fontFormat: 'monospace', fontSize: '0.8rem' }
                                                    }}>
                                                        {item.type === 'assistant' ? (
                                                            <div className="markdown-content">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {String(item.text || '')}
                                                                </ReactMarkdown>
                                                            </div>
                                                        ) : (
                                                            <Typography variant="body2" color="var(--text-primary)" fontWeight={600} sx={{ lineHeight: 1.4 }}>
                                                                {item.text}
                                                            </Typography>
                                                        )}

                                                        {item.trail && item.trail.length > 0 && (
                                                            <Stack direction="row" spacing={0.8} sx={{ mt: 1.5, opacity: 0.8 }} alignItems="center">
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.3, bgcolor: 'var(--bg-active)', borderRadius: 1.5, border: '1px solid var(--text-active)20' }}>
                                                                    <History size={12} color="var(--text-active)" />
                                                                    <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-active)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                                        Execution Trace
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                                    {item.trail.map(t => typeof t === 'object' ? `${t.agent.replace('_Agent', '')} » ${t.task || 'Delegation'}` : t).join(' ➜ ')}
                                                                </Typography>
                                                            </Stack>
                                                        )}

                                                        {(item.reasoning || item.observation) && (
                                                            <Box sx={{ mt: 1 }}>
                                                                <Button 
                                                                    size="small" variant="text" startIcon={expandedInsights[idx] ? <ShieldCheck size={12} /> : <Lightbulb size={12} />}
                                                                    onClick={() => toggleInsight(idx)}
                                                                    sx={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', p: 0, textTransform: 'none', mb: expandedInsights[idx] ? 1 : 0 }}
                                                                >
                                                                    {expandedInsights[idx] ? '사고 과정 숨기기' : '사고 과정 확인'}
                                                                </Button>
                                                                <Fade in={expandedInsights[idx]} unmountOnExit>
                                                                    <Box sx={{ p: 1.2, bgcolor: '#3b82f608', borderRadius: 2, border: '1px dashed #3b82f630' }}>
                                                                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                                                            <Lightbulb size={12} color="#3b82f6" />
                                                                            <Typography variant="caption" fontWeight="900" color="#3b82f6" sx={{ letterSpacing: '0.5px', fontSize: '0.65rem' }}>
                                                                                {i18n.language === 'en' ? 'AI ANALYSIS INSIGHT / REASONING PATH' : '지능형 사고 경로 및 분석 인사이트'}
                                                                            </Typography>
                                                                        </Stack>
                                                                        {item.reasoning && (
                                                                            <Box sx={{ 
                                                                                opacity: 0.9, fontStyle: 'italic', mb: 1, fontSize: '0.85rem', color: 'var(--text-primary)',
                                                                                '& p': { m: 0 },
                                                                                '& table': { borderCollapse: 'collapse', width: '100%', my: 1, border: '1px solid var(--border-color)' },
                                                                                '& th, & td': { border: '1px solid var(--border-color)', p: 0.5, textAlign: 'left' }
                                                                            }}>
                                                                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--text-secondary)', display: 'block', mb: 0.5 }}>
                                                                                    {i18n.language === 'en' ? '[THOUGHT]' : '[AI 추론 프로세스]'}
                                                                                </Typography>
                                                                                <div className="markdown-content">
                                                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                                        {String(item.reasoning || '')}
                                                                                    </ReactMarkdown>
                                                                                </div>
                                                                            </Box>
                                                                        )}
                                                                        {item.observation && (
                                                                            <Box sx={{ 
                                                                                opacity: 1.0, color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', mt: 1,
                                                                                '& p': { m: 0 }
                                                                            }}>
                                                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#3b82f6', display: 'block' }}>
                                                                                    {i18n.language === 'en' ? '[OBSERVATION]' : '[데이터 분석 관찰]'}
                                                                                </Typography>
                                                                                <div className="markdown-content">
                                                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                                        {String(item.observation || '')}
                                                                                    </ReactMarkdown>
                                                                                </div>
                                                                            </Box>
                                                                        )}
                                                                    </Box>
                                                                </Fade>
                                                            </Box>
                                                        )}

                                                        {item.actionRequired && (
                                                            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                                                <Button 
                                                                    variant="contained" size="small" startIcon={<Zap size={14} />}
                                                                    onClick={() => handleConfirmAction(item.actionRequired, true)}
                                                                    sx={{ borderRadius: 2, textTransform: 'none', px: 2, fontSize: '0.75rem', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                                                                >
                                                                    승인 및 실행
                                                                </Button>
                                                                <Button 
                                                                    variant="outlined" size="small"
                                                                    onClick={() => handleConfirmAction(item.actionRequired, false)}
                                                                    sx={{ borderRadius: 2, textTransform: 'none', px: 2, fontSize: '0.75rem', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                                                >
                                                                    취소
                                                                </Button>
                                                            </Stack>
                                                        )}

                                                        <Typography variant="caption" color="var(--text-secondary)" sx={{ mt: 0.5, display: 'block', fontWeight: 600, opacity: 0.7 }}>
                                                            {item.user} • {item.time}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Fade>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Container>
                </Box>

                {/* 2. Side Panel */}
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
                        <Typography variant="subtitle2" fontWeight="900" sx={{ letterSpacing: '1px', color: 'var(--text-primary)' }}>
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
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1} sx={{ justifyContent: 'space-between', width: '100%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{ p: 0.8, bgcolor: '#3b82f615', color: '#3b82f6', borderRadius: 2 }}>
                                            <Layers size={16} />
                                        </Box>
                                        <Typography variant="body2" fontWeight="800">Main Orchestrator</Typography>
                                    </Stack>
                                    <Chip label="ONLINE" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#10b98120', color: '#10b981', fontWeight: 900 }} />
                                </Stack>
                                <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block', lineHeight: 1.4, mb: 1.5 }}>
                                    {i18n.language === 'en' 
                                        ? 'Strategic reasoning and expert delegation hub for Smartwork.'
                                        : '스마트워크 시스템을 위한 전략적 추론 및 전문가 위임 허브'}
                                </Typography>
                                {/* Tool List */}
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
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1} sx={{ justifyContent: 'space-between', width: '100%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{ p: 0.8, bgcolor: '#f59e0b15', color: '#f59e0b', borderRadius: 2 }}>
                                            <Users size={16} />
                                        </Box>
                                        <Typography variant="body2" fontWeight="800">HR Specialist</Typography>
                                    </Stack>
                                    <Chip label="ACTIVE" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#10b98120', color: '#10b981', fontWeight: 900 }} />
                                </Stack>
                                <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block', lineHeight: 1.4, mb: 1.5 }}>
                                    {i18n.language === 'en' ? 'Expert in leave policies and approval procedures.' : '연차 제도 및 결재 정책 전문가'}
                                </Typography>
                                {/* Tool List */}
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
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1} sx={{ justifyContent: 'space-between', width: '100%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{ p: 0.8, bgcolor: '#10b98115', color: '#10b981', borderRadius: 2 }}>
                                            <TrendingUp size={16} />
                                        </Box>
                                        <Typography variant="body2" fontWeight="800">Attendance Analyst</Typography>
                                    </Stack>
                                    <Chip label="ACTIVE" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#10b98120', color: '#10b981', fontWeight: 900 }} />
                                </Stack>
                                <Typography variant="caption" color="var(--text-secondary)" sx={{ display: 'block', lineHeight: 1.4, mb: 1.5 }}>
                                    {i18n.language === 'en' ? 'Specialist in work hours and attendance patterns.' : '출퇴근 기록 및 근무 시간 분석 전문가'}
                                </Typography>
                                {/* Tool List */}
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
                        <Typography variant="subtitle2" fontWeight="900" sx={{ letterSpacing: '1px', mb: 2, mt: 4, opacity: 0.6 }}>
                            {i18n.language === 'en' ? 'RECENT HISTORY' : '최근 분석 히스토리'}
                        </Typography>
                        <Stack spacing={1}>
                            {history.length > 0 ? history.slice(0, 3).map((h, i) => (
                                <Box key={h._id || i} 
                                    onClick={() => {
                                        // Re-hydrate this specific activity into the current session feed
                                        setActivities(prev => [{ 
                                            user: 'You', text: h.command, time: h.createdAt, icon: UserCircle, type: 'user' 
                                        }, { 
                                            user: 'Assistant', text: h.finalResponse, 
                                            trail: h.agentTrail, observation: h.observation, reasoning: h.reasoning,
                                            time: h.createdAt, icon: Bot, type: 'assistant' 
                                        }, ...prev])
                                        setCommand('')
                                    }}
                                    sx={{ 
                                        p: 1.5, borderRadius: 3, bgcolor: 'var(--bg-primary)', 
                                        border: '1px solid var(--border-color)', cursor: 'pointer',
                                        transition: 'all 0.2s', '&:hover': { bgcolor: 'var(--card-bg)', borderColor: '#3b82f640', transform: 'translateX(4px)' }
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="center">
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
                                                {formatDate(h.createdAt)}
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
                        <Box sx={{ mt: 2, p: 2, borderRadius: 4, bgcolor: '#3b82f610', border: '1px dashed #3b82f640', textAlign: 'center' }}>
                            <Typography variant="caption" fontWeight="900" color="#3b82f6" sx={{ display: 'block', mb: 0.5, letterSpacing: '1px' }}>
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
            </Box>
    )
}

export default AgenticCanvas
