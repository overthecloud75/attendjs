import { useState } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import styled from 'styled-components'
import { v } from '../variable'
import CsvDownload from './CsvDownload'
import Pagination from './Pagination'
import Update from './Update'
import Write from './Write'

// https://github.com/CodeFocusChannel/Table-Styling-React/blob/master/src/components/styled-components-table/styles.js

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0px 30px 0px 30px;
    font-size: 14px;
`;

const Buttons = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 4px;
    margin: 16px;
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

// useTable에다가 작성한 columns와 data를 전달한 후 아래 4개의 props를 받아온다
// initialState https://github.com/TanStack/table/discussions/2029

const Table = ({ url, columns, data, setData, csvHeaders, fileName }) => {
    const [selectedRowData, setSelectedRowData] = useState({})
    // Update 화면 
    const [openUpdate, setOpenUpdate] = useState(false)
    // Write 화면 
    const [writeMode, setWriteMode] = useState(true)
    const [openWrite, setOpenWrite] = useState(false)
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,  
        page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, state: { pageIndex, pageSize } } =
        useTable({ columns, data, initialState: { pageSize: 20 } }, useSortBy, usePagination);
    const handleUpdateClick = (e, rowData) => {
        setSelectedRowData(rowData)
        if (url!=='board') {setOpenUpdate(true)}
        else {
            setOpenWrite(true)
            setWriteMode(false)
        }
    }
    const handleWriteClick = () => {
        setOpenWrite(true)
        setWriteMode(true)
    }

    return (
        <Container>
            <Buttons>
                <CsvDownload
                    data={data}
                    headers={csvHeaders}
                    filename={fileName}
                />
                {['users', 'board'].includes(url)&&(
                    <button 
                        className='defaultButton'
                        onClick={handleWriteClick}
                    >New 
                    </button>
                )}
            </Buttons>
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
                                    onClick={(e) => handleUpdateClick(e, row.original)}
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
            <Pagination
                gotoPage={gotoPage}
                canPreviousPage={canPreviousPage}
                previousPage={previousPage}
                nextPage={nextPage}
                canNextPage={canNextPage}
                pageCount={pageCount}
                pageIndex={pageIndex}
                pageOptions={pageOptions}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
            {openUpdate&&(
                <Update
                    page={url}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                />
            )}
            {openWrite&&(
                <Write
                    writeMode={writeMode}
                    page={url}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openWrite}
                    setOpen={setOpenWrite}
                    rowData={selectedRowData}
                />
            )}
        </Container>
    )
}

export default Table