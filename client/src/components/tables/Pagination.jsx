import { Box, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

const PaginationButton = ({ onClick, disabled, title, children }) => (
    <Button 
        variant='outlined'
        onClick={onClick} 
        disabled={disabled}
        title={title}
        size='small'
        sx={{ minWidth: 25, height: 25, padding: '6px 10px' }}
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
    // 페이지 번호 배열 생성 (현재 페이지 주변 2개씩)
    const getPageNumbers = () => {
        const pages = []
        // pageCount는 총 페이지 수를 나타냄 (number)
        const totalPages = parseInt(pageOptions)
        const currentPage = pageIndex + 1
        
        // 시작 페이지: 1 또는 현재 페이지 - 2 중 큰 값
        const start = Math.max(1, currentPage - 2)
        // 끝 페이지: 전체 페이지 수 또는 현재 페이지 + 2 중 작은 값
        const end = Math.min(totalPages, currentPage + 2)
        
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        
        // 시작 페이지가 1보다 크면 1 페이지와 생략 부호를 추가
        if (start > 1) {
            if (start > 2) pages.unshift('...')
            pages.unshift(1)
        }
        
        // 끝 페이지가 전체 페이지 수보다 작으면 생략 부호와 마지막 페이지를 추가
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }

        // 중복 제거 및 배열 정렬 (마지막 예외 처리)
        return pages.filter((value, index, self) => 
            value === '...' ? (index === 1 || index === self.length - 2) : self.indexOf(value) === index
        )
    }

    const pageNumbers = getPageNumbers()
    const currentPageIndex = pageIndex + 1
    const totalPages = pageCount

    // 페이지 이동 input 처리
    const handlePageInputChange = (e) => {
        const value = e.target.value
        let page = 0
        
        if (value === '') {
            return 
        }

        const pageNum = Number(value)
        if (pageNum >= 1 && pageNum <= totalPages) {
            page = pageNum - 1
            gotoPage(page)
        } else if (pageNum > totalPages) {
            // 최대 페이지보다 큰 경우 마지막 페이지로 이동
            gotoPage(totalPages - 1)
        } else if (pageNum < 1) {
            // 1보다 작은 경우 첫 페이지로 이동
            gotoPage(0)
        }
    }
    
    // 페이지 크기 변경 처리
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
                gap: 1, 
                margin: 1, 
                padding: 1, 
                borderRadius: '8px',
                flexWrap: { xs: 'wrap', md: 'nowrap' }, // 모바일에서는 줄바꿈
            }}
        >
            {/* 1. 이전/첫 페이지 버튼 그룹 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaginationButton
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    title='첫 페이지'
                >
                    <ChevronsLeft size={16} />
                </PaginationButton>
                <PaginationButton
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    title='이전 페이지'
                >
                    <ChevronLeft size={16} />
                </PaginationButton>
            </Box>
            
            {/* 2. 페이지 번호 버튼 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {pageNumbers.map((pageNum, index) => {
                    const isCurrent = pageNum === currentPageIndex

                    return (
                        <Button
                            key={pageNum}
                            onClick={() => gotoPage(pageNum - 1)}
                            variant={isCurrent ? 'contained' : 'outlined'}
                            color={isCurrent ? 'primary' : 'inherit'}
                            size='small'
                            sx={{
                                minWidth: 35,
                                height: 25,
                                padding: '6px 10px',
                                fontSize: 14,
                                fontWeight: isCurrent ? 600 : 400,
                                '&:hover:not([disabled])': {
                                    backgroundColor: isCurrent ? 'primary.dark' : '#f3f4f6',
                                    borderColor: isCurrent ? 'primary.main' : '#d1d5db',
                                },
                            }}
                            aria-current={isCurrent ? 'true' : 'false'}
                            title={`${pageNum} 페이지`}
                        >
                            {pageNum}
                        </Button>
                    )
                })}
            </Box>

            {/* 3. 다음/마지막 페이지 버튼 그룹 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaginationButton
                    onClick={() => nextPage()} 
                    disabled={!canNextPage}
                    title='다음 페이지'
                >
                    <ChevronRight size={16} />
                </PaginationButton>
                <PaginationButton
                    onClick={() => gotoPage(pageCount - 1)} 
                    disabled={!canNextPage}
                    title='마지막 페이지'
                >
                    <ChevronsRight size={16} />
                </PaginationButton>
            </Box>
            
            {/* 4. 페이지 정보 (N/M) */}
            <Typography variant='body2' color='text.secondary' sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                페이지
                <Typography component='span' fontWeight='bold' sx={{ mx: 0.5 }}>
                    {currentPageIndex} / {totalPages}
                </Typography>
            </Typography>
            
            {/* 5. 페이지 이동 Input */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                <Typography variant='body2' color='text.secondary'>
                    이동:
                </Typography>
                <TextField
                    type='number'
                    defaultValue={currentPageIndex}
                    onChange={(e) => {
                        handlePageInputChange(e)
                    }}
                    onBlur={handlePageInputChange}
                    slotProps={{ 
                        input: {
                            min: 1, 
                            max: totalPages, 
                            style: { padding: '4px 4px', textAlign: 'center' } // 내부 스타일 조정
                        }
                    }}
                    sx={{ 
                        width: { xs: 50, sm: 60 }, // 모바일에서 너비 조정
                        '& input': { height: 7 }, // 높이 조정
                    }}
                    size='small'
                    variant='outlined'
                    title='페이지 번호 입력'
                />
            </Box>

            {/* 6. 페이지당 항목 수 Select */}
            <Box sx={{ 
                display: { xs: 'none', sm: 'flex' }, // 600px 미만에서 숨김 처리 (PageSizeGroup)
                alignItems: 'center', 
                gap: 0.5 
            }}>
                <FormControl variant='outlined' size='small'>
                    <InputLabel id='page-size-label'>표시</InputLabel>
                    <Select
                        labelId='page-size-label'
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        label='표시'
                        sx={{ fontSize: 14, height: 30, width: 80 }}
                        title='페이지당 항목 수 선택'
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}개
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    )
}

export default Pagination