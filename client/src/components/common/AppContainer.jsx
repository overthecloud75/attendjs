import React from 'react';
import { Box, Fade, Container } from '@mui/material';

/**
 * 표준 페이지 컨테이너 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.children - 하위 콘텐츠
 * @param {string} props.maxWidth - 최대 너비 (xs, sm, md, lg, xl, false)
 * @param {number} props.timeout - 애니메이션 효과 지속 시간
 * @param {string} props.sx - MUI 추가 스타일
 */
const AppContainer = ({ children, maxWidth = 'xl', timeout = 600, sx = {}, ...props }) => {
    return (
        <Fade in timeout={timeout}>
            <Box sx={{ 
                p: { xs: 2.5, md: 4 }, 
                flex: 1, 
                width: '100%', 
                minHeight: '100%',
                bgcolor: 'var(--bg-primary, #f9fafb)',
                transition: 'all 0.4s ease-out',
                display: 'flex',
                flexDirection: 'column',
                ...sx
            }} {...props}>
                <Container maxWidth={maxWidth} disableGutters sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {children}
                </Container>
            </Box>
        </Fade>
    );
};

export default AppContainer;
