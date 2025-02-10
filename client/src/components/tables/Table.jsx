import { useState } from 'react'
import { 
    useReactTable, 
    flexRender, 
    getCoreRowModel, 
    getPaginationRowModel, 
    getSortedRowModel 
} from '@tanstack/react-table'
import styled from 'styled-components'
import { v } from '../../variable.js'
import Pagination from './Pagination.jsx'
import Update from './UpdateDialog.jsx'
import CardUpdate from './CardUpdate.jsx'
import ApprovalUpdate from './ApprovalUpdate.jsx'
import EditWrite from './EditWrite.jsx'
import { UserEditablePages, UpdatablePages } from '../../configs/pages.js'
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
    background: #e3f2fd;
`

const Th = styled.th`
    padding: ${v.smSpacing};
    border: 0px solid;
    color: blue;
    text-transform: capitalize;
    font-weight: 550;
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

// https://geuni620.github.io/blog/2023/12/2/tanstack-table/
const Table = ({url, columns, data, setData, csvHeaders, fileName}) => {
    // update시 page 설정
    const [selectedRowData, setSelectedRowData] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    })
    // Update 화면 
    const [openUpdate, setOpenUpdate] = useState(false)
    // Write 화면, if writeMode is true, use empty value. else use existing value 
    const [writeMode, setWriteMode] = useState(true)
    const [openEditWrite, setOpenEditWrite] = useState(false)
    // eslint-disable-next-line
    const table =
        useReactTable({
            columns, 
            data, 
            state:{ pagination }, 
            getCoreRowModel: getCoreRowModel(), 
            getPaginationRowModel: getPaginationRowModel(), 
            getSortedRowModel: getSortedRowModel(),
            onPaginationChange: setPagination,
        })
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
            <TableSheet
                style={url==='device'?{width:'130%'}:{width:'100%'}}
            >
                <THead>
                    {table.getHeaderGroups().map(headerGroup => {
                        return (
                            <HeadTr key={headerGroup.id}>
                                <Th>No</Th>
                                {headerGroup.headers.map(header => (
                                    <Th 
                                        key={header.id} 
                                        colSpan={header.colSpan}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Th>
                                ))}
                            </HeadTr>
                    )})}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row, rowIndex) => {
                        return (
                            <BodyTr key={row.id}>
                                <Td 
                                    onClick={(e) => handleUpdateClick(e, row.original)}
                                    style={{textDecoration: 'underline'}}
                                >
                                    { table.getState().pagination.pageIndex * table.getState().pagination.pageSize + rowIndex + 1 }
                                </Td>
                                {row.getVisibleCells().map(cell => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>  
                                    )   
                                )}
                            </BodyTr>
                        )
                    })}
                </TBody>
            </TableSheet>
            <Pagination
                gotoPage={table.setPageIndex}
                canPreviousPage={table.getCanPreviousPage()}
                previousPage={table.previousPage}
                nextPage={table.nextPage}
                canNextPage={table.getCanNextPage()}
                pageCount={table.getPageCount().toLocaleString()}
                pageIndex={table.getState().pagination.pageIndex}
                pageOptions={table.getPageCount().toLocaleString()}
                pageSize={table.getState().pagination.pageSize}
                setPageSize={table.setPageSize}
            />
            {openUpdate&&(url==='approval'?
                <ApprovalUpdate
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                />:(url==='creditcard'?
                <CardUpdate
                    writeMode={writeMode}
                    page={url}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                />:
                <Update
                    writeMode={writeMode}
                    page={url}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                />
            ))}
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