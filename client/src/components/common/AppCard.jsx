import React from 'react';
import { Paper, Box } from '@mui/material';

/**
 * 표준 마스터 카드 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.children - 하위 콘텐츠
 * @param {boolean} props.active - 강조 여부 (테두리 컬러 등)
 * @param {string} props.sx - MUI 추가 스타일
 * @param {string} props.color - 활성화 시 포인트 컬러 (기본: #3b82f6)
 */
const AppCard = ({ children, active, color = '#3b82f6', sx = {}, ...props }) => {
    return (
        <Paper 
            elevation={0}
            sx={{ 
                borderRadius: 5, 
                bgcolor: 'var(--card-bg, #ffffff)', 
                border: active ? `2px solid ${color}` : '1px solid var(--border-color, #e5e7eb)', 
                boxShadow: active ? `0 20px 40px ${color}10` : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: active ? `0 24px 48px ${color}15` : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    borderColor: !active && `${color}30`
                },
                ...sx
            }}
            {...props}
        >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                {children}
            </Box>
        </Paper>
    );
};

export default AppCard;
