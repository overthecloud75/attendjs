import { useState } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import styled from 'styled-components'
import { v } from '../../variable'
import Pagination from './Pagination'
import Update from './Update'
import ApprovalUpdate from './ApprovalUpdate'
import EditWrite from './EditWrite'
import { UserEditablePages, UpdatablePages } from '../../configs/pages'
import TableButtons from './TableButtons.jsx'

const Container = styled.div`
    width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 5px 0 5px;
    font-size: 14px;
    @media screen and (max-width: 600px) {
        font-size: 11px;
    }
`

const TableSheet = styled.table`
    border-collapse: collapse;
    text-align: center;
    border-radius: ${v.borderRadius};
    overflow-x: auto;
`

const THead = styled.thead`
    position: sticky;
    z-index: 100;
`

const HeadTr = styled.tr`
    background: #007AFF;
`

const Th = styled.th`
    padding: ${v.smSpacing};
    border: 1px solid;
    color: white;
    text-transform: capitalize;
    font-weight: 600;
    @media screen and (max-width: 600px) {
        padding-left: 0px;
        padding-right: 0px
    }
`

const Td = styled.td`
    padding: ${v.smSpacing};
    border-bottom: 1px solid #F2F2F2; 
    color #2E2E2E; 
    font-weight: 400;
    @media screen and (max-width: 600px) {
        padding-left: 0px;
        padding-right: 0px
    }
`

const TBody = styled.tbody`
`

const BodyTr = styled.tr`
    background-color: transparent;
`

// useTable에다가 작성한 columns와 data를 전달한 후 아래 4개의 props를 받아온다
// initialState https://github.com/TanStack/table/discussions/2029

const Table = ({url, columns, data, setData, csvHeaders, fileName}) => {
    // update시 page 설정
    const [selectedRowData, setSelectedRowData] = useState({})
    // Update 화면 
    const [openUpdate, setOpenUpdate] = useState(false)
    // Write 화면, if writeMode is true, use empty value. else use existing value 
    const [writeMode, setWriteMode] = useState(true)
    const [openEditWrite, setOpenEditWrite] = useState(false)
    // eslint-disable-next-line
    const {getTableProps, getTableBodyProps, headerGroups, prepareRow,  
        page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, state: {pageIndex, pageSize}} =
        useTable({columns, data, initialState:{ pageSize: 20}}, useSortBy, usePagination)
    // when url is board, open write 
    const handleUpdateClick = (e, rowData) => {
        setSelectedRowData(rowData)
        setWriteMode(false)
        if (UpdatablePages.includes(url)) { 
            setOpenUpdate(true) 
        } else if (UserEditablePages.includes(url)) {
            setOpenEditWrite(true)
        }
    }
    return (
        <Container>
            <TableButtons
                url={url}   
                data={data}
                csvHeaders={csvHeaders}
                fileName={fileName}
                writeMode={writeMode}
                setWriteMode={setWriteMode}
                setOpenEditWrite={setOpenEditWrite}
                setSelectedRowData={setSelectedRowData}
                setOpenUpdate={setOpenUpdate}
            />
            <TableSheet {...getTableProps()}
                style={url==='device'?{width:'130%'}:{width:'100%'}}
            >
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
            {openUpdate&&url==='approval'?(
                <ApprovalUpdate
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                />):(
                <Update
                    writeMode={writeMode}
                    page={url}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                />)
            }
            {openEditWrite&&
                <EditWrite
                    writeMode={writeMode}
                    page={url}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openEditWrite}
                    setOpen={setOpenEditWrite}
                    rowData={selectedRowData}
                />
            }
        </Container>
    )
}

export default Table