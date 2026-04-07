import React from 'react';
import { Chip, Stack, Typography, Box } from '@mui/material';
import { Dot, CheckCircle, Clock, AlertCircle, ShieldAlert, Zap } from 'lucide-react';

/**
 * 표준 상태 뱃지 컴포넌트
 * @param {Object} props
 * @param {string} props.status - 상태 타입 (success, warning, error, info, neutral)
 * @param {string} props.label - 표시 이름
 * @param {boolean} props.dot - 점 표시 여부
 * @param {string} props.size - 크기 (small, medium)
 */
const StatusBadge = ({ status = 'info', label, dot = true, size = 'small' }) => {
    
    // 상태에 따른 테마 색상 및 아이콘 정의
    const THEMES = {
        success: { color: '#10b981', bgcolor: '#10b98115', icon: CheckCircle },
        warning: { color: '#f59e0b', bgcolor: '#f59e0b15', icon: Clock },
        error: { color: '#ef4444', bgcolor: '#ef444415', icon: AlertCircle },
        info: { color: '#3b82f6', bgcolor: '#3b82f615', icon: Zap },
        neutral: { color: '#6b7280', bgcolor: '#6b728015', icon: Dot },
        danger: { color: '#ef4444', bgcolor: '#ef444415', icon: ShieldAlert }
    };

    const theme = THEMES[status] || THEMES.neutral;
    const Icon = theme.icon;

    return (
        <Chip 
            label={label}
            size={size}
            icon={dot ? <Icon size={14} style={{ color: theme.color, marginLeft: 8 }} /> : undefined}
            sx={{ 
                bgcolor: theme.bgcolor, 
                color: theme.color,
                fontWeight: 800,
                fontSize: size === 'small' ? '0.7rem' : '0.85rem',
                borderRadius: 2.5,
                border: `1px solid ${theme.color}20`,
                '& .MuiChip-label': { px: 1.5, letterSpacing: '0.2px' },
                '& .MuiChip-icon': { ml: 0.5 }
            }}
        />
    );
};

export default StatusBadge;
