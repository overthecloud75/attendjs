import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Stack, Chip, Divider, Avatar, Badge } from '@mui/material';
import { Bot, UserCheck, CalendarDays, Receipt, Zap } from 'lucide-react';
import { styled } from '@mui/material/styles';

const AGENT_SQUAD = [
    {
        id: 'main',
        name: 'Master Orchestrator',
        role: 'Orchestration & Planning',
        description: '사용자의 복잡한 의도를 분석하고 최적의 전문가 유닛에게 작업을 할당하며 최종 답변을 합성합니다.',
        status: 'Active',
        icon: Bot,
        color: '#3b82f6',
        tools: ['Intent Analysis', 'Task Delegation', 'Synthesis Engine']
    },
    {
        id: 'attendance',
        name: 'Attendance Specialist',
        role: 'Time & Attendance Analyst',
        description: '출퇴근 기록, 근무 패턴 분석, 근태 정책 위반 여부를 조사하고 리포트를 생성합니다.',
        status: 'Active',
        icon: CalendarDays,
        color: '#10b981',
        tools: ['Attend History API', 'Leave Policy Engine', 'Stat Analyzer']
    },
    {
        id: 'expense',
        name: 'Expense Specialist',
        role: 'Financial Compliance Agent',
        description: '영수증 OCR 분석 및 법인카드 매칭을 통해 지출 정산을 자동화하고 규정 준수를 검토합니다.',
        status: 'Standby',
        icon: Receipt,
        color: '#8b5cf6',
        tools: ['Multimodal OCR', 'Transaction Matcher', 'Policy Validator']
    },
    {
        id: 'hr',
        name: 'HR Guide Agent',
        role: 'Human Resources Consultant',
        description: '인사 규정, 연차 제도, 조직 구성원 정보에 대한 가이드를 제공하고 행정 절차를 안내합니다.',
        status: 'Active',
        icon: UserCheck,
        color: '#f59e0b',
        tools: ['Employee Database', 'HR Policy Search', 'Document Generator']
    }
];

const SquadRoster = () => {
    return (
        <Box sx={{ py: 2 }}>
            <Typography variant="h6" fontWeight="800" sx={{ mb: 1, color: 'var(--text-primary)' }}>
                Active Agent Squad
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                현재 귀하의 업무를 지원하기 위해 가동 중인 지능형 전문가 유닛들입니다.
            </Typography>

            <Grid container spacing={3}>
                {AGENT_SQUAD.map((agent) => (
                    <Grid size={{ xs: 12, md: 6 }} key={agent.id}>
                        <StyledAgentCard color={agent.color}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'flex-start' }}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                bgcolor: agent.status === 'Active' ? '#10b981' : '#94a3b8',
                                                color: agent.status === 'Active' ? '#10b981' : '#94a3b8',
                                                boxShadow: `0 0 0 2px var(--card-bg)`,
                                                '&::after': {
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '50%',
                                                    animation: agent.status === 'Active' ? 'ripple 1.2s infinite ease-in-out' : 'none',
                                                    border: '1px solid currentColor',
                                                    content: '""',
                                                },
                                            },
                                            '@keyframes ripple': {
                                                '0%': { transform: 'scale(.8)', opacity: 1 },
                                                '100%': { transform: 'scale(2.4)', opacity: 0 },
                                            },
                                        }}
                                    >
                                        <Avatar 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                bgcolor: `${agent.color}15`, 
                                                color: agent.color,
                                                border: `1px solid ${agent.color}30`
                                            }}
                                        >
                                            <agent.icon size={28} />
                                        </Avatar>
                                    </Badge>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="800" sx={{ color: 'var(--text-primary)' }}>
                                            {agent.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: agent.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {agent.role}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3, minHeight: 40, lineHeight: 1.6 }}>
                                    {agent.description}
                                </Typography>

                                <Divider sx={{ mb: 2, opacity: 0.6 }} />

                                <Typography variant="caption" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, color: 'var(--text-primary)' }}>
                                    <Zap size={12} /> BINDED TOOLS
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                    {agent.tools.map((tool) => (
                                        <Chip 
                                            key={tool} 
                                            label={tool} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ 
                                                fontSize: '10px', 
                                                fontWeight: 600, 
                                                borderRadius: '6px',
                                                borderColor: 'var(--border-color)',
                                                color: 'var(--text-secondary)',
                                                bgcolor: 'var(--bg-secondary)'
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </StyledAgentCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const StyledAgentCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'color'
})(({ color }) => ({
    height: '100%',
    width: '100%',
    borderRadius: '20px',
    bgcolor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 20px 40px -12px ${color}20`,
        borderColor: `${color}60`,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        backgroundColor: color,
        opacity: 0.8
    }
}));

export default SquadRoster;
