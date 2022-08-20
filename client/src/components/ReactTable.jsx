import { useState } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import styled from 'styled-components'
import { CSVLink } from "react-csv"
import { v } from '../variable'
import Update from './Update';

// https://github.com/CodeFocusChannel/Table-Styling-React/blob/master/src/components/styled-components-table/styles.js

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 30px 30px;
    font-size: 14px;
`;

const TableSheet = styled.table`
    border-collapse: collapse;
    text-align: center;
    border-radius: ${v.borderRadius};
    overflow: hidden;
`;

const THead = styled.thead`
    position: sticky;
    z-index: 100;
`;

const HeadTr = styled.tr`
    background: black;
`;

const Th = styled.th`
    font-weight: normal;
    padding: ${v.smSpacing};
    border: 1px solid ${({ theme }) => theme.bg2};
    color: white;
    text-transform: capitalize;
    font-weight: 600;
`;

const Td = styled.td`
    padding: ${v.smSpacing};
    border: 1px solid ${({ theme }) => theme.bg2};  
    font-size: 14px;
`;

const TBody = styled.tbody`
`;

const BodyTr = styled.tr`
    background-color: transparent;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 16px;
`;

const PageButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin: 0;
  background: black;
  color: white;
  font-size: 1rem;

  &:hover {
    background: tomato;
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
`;

const PageSpan = styled.span`
    margin: 0px 5px;
`;

const PageInput = styled.input`
    margin: 0px 5px;
    padding: 8px 8px;
    border: 1px solid;
	border-radius: 8px;
    width: 50px;
    background-color: transparent;
	}
`;

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
`;

const CsvButton = styled.button`
    background-color: #0071c2;
    color: white;
    font-weight: 500;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
`;

// useTable에다가 작성한 columns와 data를 전달한 후 아래 4개의 props를 받아온다
// initialState https://github.com/TanStack/table/discussions/2029

const Table = ({ url, columns, data, setData, csvHeaders, fileName }) => {
    const [selectedRowData, setSelectedRowData] = useState({})
    const [open, setOpen] = useState(false)
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,  
        page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, state: { pageIndex, pageSize } } =
        useTable({ columns, data, initialState: { pageSize: 20 } }, useSortBy, usePagination);
    const handleClick = (e, rowData) => {
        setSelectedRowData(rowData)
        setOpen(true)
    }

    return (
        <Container>
            <TableSheet {...getTableProps()}>
                <THead>
                    {headerGroups.map(header => (
                    // getHeaderGroupProps를 통해 header 배열을 호출한다
                        <HeadTr {...header.getHeaderGroupProps()}>
                            <Th>No</Th>
                            {header.headers.map(col => (
                            // getHeaderProps는 각 셀 순서에 맞게 header를 호출한다
                            <Th {...col.getHeaderProps(col.getSortByToggleProps())}>{col.render('Header')}</Th>
                            ))}
                        </HeadTr>
                    ))}
                </THead>
                <TBody {...getTableBodyProps()}>
                    {page.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            // getRowProps는 각 row data를 호출해낸다
                            <BodyTr {...row.getRowProps()}>
                                <Td 
                                    onClick={(e) => handleClick(e, row.original)}
                                    style={{textDecoration: 'underline'}}
                                >
                                    { pageIndex * pageSize + rowIndex + 1 }
                                </Td>
                                {row.cells.map(cell => (
                                    // getCellProps는 각 cell data를 호출해낸다
                                    <Td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </Td>  
                                    )   
                                )}
                            </BodyTr>
                        )
                    })}
                </TBody>
            </TableSheet>
            <Pagination>
                <PageButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </PageButton>{" "}
                <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {"<"}
                </PageButton>{" "}
                <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </PageButton>{" "}
                <PageButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </PageButton>{" "}
                <PageSpan>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </PageSpan>
                <PageSpan>
                    Go to page:{" "}
                    <PageInput
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        gotoPage(page);
                        }}
                    />
                </PageSpan>{" "}
                <PageSelect
                    value={pageSize}
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
                <CsvButton>
                    <CSVLink 
                        data={data}
                        headers={csvHeaders}
                        filename={fileName}
                    >
                        CSV download
                    </CSVLink>
                </CsvButton>
            </Pagination>
            {open&&
                (
                    <Update
                        page={url}
                        columns={columns}
                        data={data}
                        setData={setData}
                        open={open}
                        setOpen={setOpen}
                        rowData={selectedRowData}
                    />
                )
            }
        </Container>
    )
}

export default Table