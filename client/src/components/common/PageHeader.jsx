import React from 'react';
import { Box, Typography, Fade } from '@mui/material';

/**
 * 표준 페이지 헤더 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Lucide 아이콘 등
 * @param {string} props.title - 페이지 제목
 * @param {string} props.subtitle - 페이지 설명/부제
 * @param {string} props.color - 테마 포인트 컬러 (기본: #3b82f6)
 * @param {React.ReactNode} props.extra - 우측 추가 컨트롤 (버튼 등)
 */
const PageHeader = ({ icon: Icon, title, subtitle, color = '#3b82f6', extra }) => {
    return (
        <Fade in timeout={600}>
            <Box mb={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                        sx={{ 
                            p: 1.2, 
                            bgcolor: `${color}15`, 
                            color: color, 
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 16px ${color}10`
                        }}
                    >
                        {Icon && <Icon size={28} />}
                    </Box>
                    <Box>
                        <Typography 
                            variant="h5" 
                            fontWeight="900" 
                            sx={{ 
                                color: 'var(--text-primary)', 
                                letterSpacing: '-0.5px',
                                textTransform: 'capitalize' 
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'var(--text-secondary)', 
                                opacity: 0.8,
                                fontWeight: 500
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>
                </Box>
                
                {extra && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {extra}
                    </Box>
                )}
            </Box>
        </Fade>
    );
};

export default PageHeader;
