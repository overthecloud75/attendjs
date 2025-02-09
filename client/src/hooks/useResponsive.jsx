import { useMemo } from 'react'

export const useResponsive = () => {
    const isMobile = useMemo(() => window.innerWidth <= 600, [])
    return { isMobile }
}