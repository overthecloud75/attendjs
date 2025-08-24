import styled from 'styled-components'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'

const Paginate = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 10px 5px 10px 5px;
    padding: 5px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    border: 1px solid #e1e5e9;

    @media screen and (max-width: 768px) {
        flex-wrap: wrap;
        gap: 6px;
    }

    @media screen and (max-width: 600px) {
        margin: 5px
    }
`

const NavigationGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const PageButton = styled.button`
    border: none;
    border-radius: 8px;
    padding: 8px;
    margin: 0;
    background: white;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    border: 1px solid #e1e5e9;
    
    &:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        border-color: transparent;
    }

    &:active {
        transform: translateY(0);
    }

    &[disabled] {
        background: #f1f5f9;
        color: #94a3b8;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
        border-color: #e1e5e9;
    }

    &[aria-current="true"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        border-color: transparent;
    }
    
    @media screen and (max-width: 768px) {
        padding: 3px;
    }
`

const PageInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    
    @media screen and (max-width: 768px) {
        font-size: 13px;
    }
    
    @media screen and (max-width: 600px) {
        font-size: 11px;
        gap: 3px;
    }
`

const PageSpan = styled.span`
    margin: 0px 5px;
    
    @media screen and (max-width: 600px) {
        margin: 0px 2px;
    }
`

const PageInput = styled.input`
    margin: 0px 5px;
    padding: 8px 8px;
    border: 1px solid;
	border-radius: 8px;
    width: 50px;
    background-color: transparent;
    justify-content: center;

    @media screen and (max-width: 600px) {
        padding: 3px 3px;
        margin: 0px 2px;
        width: 25px;
    }
`

const PageSelect = styled.select`
    margin: 0 8px;
    padding: 8px 12px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    background-color: white;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &:hover {
        border-color: #667eea;
    }
    
    @media screen and (max-width: 768px) {
        padding: 3px 3px;
        margin: 0px 2px;
        display: None
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
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    
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