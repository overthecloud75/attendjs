import styled from 'styled-components'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'

const Paginate = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin: 5px 5px;
    padding: 5px;
    border-radius: 8px;

    @media screen and (max-width: 768px) {
        flex-wrap: wrap;
        gap: 3px;
    }
`

const NavigationGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const PageButton = styled.button`
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    min-width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: background 0.15s ease, border-color 0.15s ease;

    &:hover:not([disabled]) {
        background: #f3f4f6;
        border-color: #d1d5db;
    }

    &[disabled] {
        background: #f9fafb;
        color: #9ca3af;
        cursor: not-allowed;
    }

    &[aria-current="true"] {
        background: #e5e7eb;
        border-color: #d1d5db;
        font-weight: 600;
    }

    @media screen and (max-width: 768px) {
        min-width: 25px;
        height: 25px;
        padding: 4px;
    }
`

const PageInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    font-size: 14px;

    @media screen and (max-width: 768px) {
        font-size: 13px;
    }
`

const PageSpan = styled.span`
    margin: 0 4px;
`

const PageInput = styled.input`
    width: 48px;
    padding: 6px 4px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #ffffff;
    color: #374151;
    text-align: center;

    &:focus {
        outline: none;
        border-color: #6b7280;
    }

    @media screen and (max-width: 600px) {
        width: 32px;
        padding: 4px;
    }
`

const PageSelect = styled.select`
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #ffffff;
    color: #374151;
    font-size: 14px;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #6b7280;
    }

    @media screen and (max-width: 768px) {
        padding: 4px;
        font-size: 13px;
    }

    @media screen and (max-width: 600px) {
        display: none;
    }
`

const PageSizeGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    @media screen and (max-width: 600px) {
        display: none;
    }
`

const PageSizeLabel = styled.span`
    color: #6b7280;
    font-size: 14px;

    @media screen and (max-width: 768px) {
        font-size: 13px;
    }
`

const Pagination = ({gotoPage, canPreviousPage, previousPage, nextPage, 
    canNextPage, pageCount, pageIndex, pageOptions, pageSize, setPageSize}) => {

    // 페이지 번호 배열 생성 (현재 페이지 주변 2개씩)
    const getPageNumbers = () => {
        const pages = [];
        const totalPages = parseInt(pageOptions)
        const currentPage = pageIndex + 1
        
        const start = Math.max(1, currentPage - 2)
        const end = Math.min(totalPages, currentPage + 2)
        
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }   
        return pages
    }
    const pageNumbers = getPageNumbers()
    return (
        <Paginate>
            <NavigationGroup>
                <PageButton 
                    onClick={() => gotoPage(0)} 
                    disabled={!canPreviousPage}
                    title='첫 페이지'
                >
                    <FirstPageIcon style={{ fontSize: 20 }} />
                </PageButton>
                
                <PageButton 
                    onClick={() => previousPage()} 
                    disabled={!canPreviousPage}
                    title='이전 페이지'
                >
                    <ChevronLeftIcon style={{ fontSize: 20 }} />
                </PageButton>
            </NavigationGroup>
            
            {pageNumbers.map(pageNum => (
                <PageButton
                    key={pageNum}
                    onClick={() => gotoPage(pageNum - 1)}
                    aria-current={pageNum === pageIndex + 1 ? 'true' : 'false'}
                    title={`${pageNum} 페이지`}
                >
                    {pageNum}
                </PageButton>
            ))}
            <PageInfo>
                <span>페이지</span>
                <PageSpan>
                    {pageIndex + 1} / {pageCount}
                </PageSpan>
            </PageInfo>
            
            <PageInfo>
                <span>이동:</span>
                <PageInput
                    type='number'
                    defaultValue={pageIndex + 1}
                    min={1}
                    max={pageOptions.length}
                    name='gotoPage'
                    onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }}
                    title='페이지 번호 입력'
                />
            </PageInfo>

            <NavigationGroup>
                <PageButton 
                    onClick={() => nextPage()} 
                    disabled={!canNextPage}
                    title='다음 페이지'
                >
                    <ChevronRightIcon style={{ fontSize: 20 }} />
                </PageButton>
                
                <PageButton 
                    onClick={() => gotoPage(pageCount - 1)} 
                    disabled={!canNextPage}
                    title='마지막 페이지'
                >
                    <LastPageIcon style={{ fontSize: 20 }} />
                </PageButton>
            </NavigationGroup>
            
            <PageSizeGroup>
                <PageSizeLabel>표시:</PageSizeLabel>
                <PageSelect
                    value={pageSize}
                    name='pageSize'
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                    title="페이지당 항목 수 선택"
                >
                    {[10, 20, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}개
                        </option>
                    ))}
                </PageSelect>
            </PageSizeGroup>
        </Paginate>
    )
}

export default Pagination