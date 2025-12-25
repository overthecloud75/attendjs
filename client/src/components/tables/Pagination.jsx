import { Box, Button, Typography, Select, MenuItem, FormControl } from '@mui/material'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

const PaginationButton = ({ onClick, disabled, title, children }) => (
    <Button
        variant='text'
        color='inherit'
        onClick={onClick}
        disabled={disabled}
        title={title}
        size='small'
        sx={{
            minWidth: 32,
            height: 32,
            padding: 0,
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            '&:hover': {
                backgroundColor: 'var(--hover-bg)',
                color: 'var(--text-primary)'
            },
            '&:disabled': {
                color: 'var(--text-secondary)',
                opacity: 0.5
            }
        }}
    >
        {children}
    </Button>
)

const Pagination = ({
    gotoPage,
    canPreviousPage,
    previousPage,
    nextPage,
    canNextPage,
    pageCount,
    pageIndex,
    pageOptions,
    pageSize,
    setPageSize,
}) => {
    // 페이지 번호 배열 생성 logic similar to before but simplified
    const getPageNumbers = () => {
        const pages = []
        const totalPages = parseInt(pageCount)
        const currentPage = pageIndex + 1

        let start = Math.max(1, currentPage - 1)
        let end = Math.min(totalPages, currentPage + 1)

        if (currentPage === 1) end = Math.min(totalPages, 3)
        if (currentPage === totalPages) start = Math.max(1, totalPages - 2)

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (start > 1) {
            if (start > 2) pages.unshift('...')
            pages.unshift(1)
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()
    const currentPageIndex = pageIndex + 1
    const totalPages = pageCount

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value))
    }

    return (
        <Box
            component='div'
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 24px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                mt: 'auto',
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: 4 // increased gap between sections
            }}
        >
            {/* Left side: Page Size & Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl variant='standard' size='small'>
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        disableUnderline
                        sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            '& .MuiSelect-select': { py: 0.5, pr: 3 },
                            '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                        }}
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <MenuItem key={size} value={size} sx={{ fontSize: 13 }}>
                                {size}개씩 보기
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant='body2' sx={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    총 {totalPages} 페이지 중 <Box component="span" fontWeight="600" color="var(--text-primary)">{currentPageIndex}</Box>
                </Typography>
            </Box>

            {/* Right side: Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PaginationButton
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    title='첫 페이지'
                >
                    <ChevronsLeft size={18} />
                </PaginationButton>
                <PaginationButton
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    title='이전 페이지'
                >
                    <ChevronLeft size={18} />
                </PaginationButton>

                <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
                    {pageNumbers.map((pageNum, index) => {
                        if (pageNum === '...') {
                            return <Typography key={`dots-${index}`} sx={{ mx: 1, color: '#94a3b8' }}>...</Typography>
                        }

                        const isCurrent = pageNum === currentPageIndex
                        return (
                            <Button
                                key={pageNum}
                                onClick={() => gotoPage(pageNum - 1)}
                                size='small'
                                sx={{
                                    minWidth: 32,
                                    height: 32,
                                    mx: 0.25,
                                    borderRadius: '8px',
                                    padding: 0,
                                    fontSize: 13,
                                    fontWeight: isCurrent ? 600 : 400,
                                    backgroundColor: isCurrent ? '#4f46e5' : 'transparent',
                                    color: isCurrent ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: isCurrent ? '0 2px 4px rgba(79, 70, 229, 0.2)' : 'none',
                                    '&:hover': {
                                        backgroundColor: isCurrent ? '#4338ca' : 'var(--hover-bg)',
                                    },
                                }}
                            >
                                {pageNum}
                            </Button>
                        )
                    })}
                </Box>

                <PaginationButton
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    title='다음 페이지'
                >
                    <ChevronRight size={18} />
                </PaginationButton>
                <PaginationButton
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    title='마지막 페이지'
                >
                    <ChevronsRight size={18} />
                </PaginationButton>
            </Box>
        </Box>
    )
}

export default Pagination