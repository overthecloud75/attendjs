import { useMemo } from 'react'
import { MOBILE } from '../configs/mobile'

export const useResponsive = () => {
    const isMobile = useMemo(() => window.innerWidth <= MOBILE.size, [])
    return { isMobile }
}