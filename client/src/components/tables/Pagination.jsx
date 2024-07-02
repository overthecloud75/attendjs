import styled from 'styled-components'

const Paginate = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 16px;
    @media screen and (max-width: 600px) {
        margin: 5px
    }
`

const PageButton = styled.button`
    border: none;
    border-radius: 8px;
    padding: 8px;
    margin: 0;
    background: #2E2E2E;
    color: white;

    &:hover {
        background: #007AFF;
        cursor: pointer;
        transform: translateY(-2px);
    }

    &[disabled] {
        background: grey;
        cursor: revert;
        transform: revert;
    }

    &[aria-current] {
        background: deeppink;
        font-weight: bold;
        cursor: revert;
        transform: revert;
    }
    
    @media screen and (max-width: 600px) {
        padding: 3px;
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
    margin: 0px 5px;
	display: block;
	padding: 8px 8px;
	border: 1px solid;
	border-radius: 8px;

	background-color: transparent;
	&:focus {
		border-color: red;
	}
    
    @media screen and (max-width: 600px) {
        padding: 3px 3px;
        margin: 0px 2px;
        display: None
    }
`

const Pagination = ({gotoPage, canPreviousPage, previousPage, nextPage, 
    canNextPage, pageCount, pageIndex, pageOptions, pageSize, setPageSize}) => {
    return (
        <Paginate>
            <PageButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
            </PageButton>{' '}
            <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
            </PageButton>{' '}
            <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
            </PageButton>{' '}
            <PageButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
            </PageButton>{' '}
            <PageSpan>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </PageSpan>
            <PageSpan>
                Go to page:{' '}
                <PageInput
                    type='number'
                    defaultValue={pageIndex + 1}
                    name='gotoPage'
                    onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }}
                />
            </PageSpan>{' '}
            <PageSelect
                value={pageSize}
                name='pageSize'
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                }}
            >
                {[20, 40, 60].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                ))}
            </PageSelect>
        </Paginate>
    )
}

export default Pagination