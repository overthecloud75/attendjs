import { useState } from 'react'
import { 
    useReactTable, 
    flexRender, 
    getCoreRowModel, 
    getPaginationRowModel, 
    getSortedRowModel 
} from '@tanstack/react-table'
import { 
    Box,
    Typography,
} from '@mui/material'
import styled from 'styled-components'
import Pagination from './Pagination.jsx'
import Update from './UpdateDialog.jsx'
import CardUpdate from './CardUpdate.jsx'
import ApprovalUpdate from './ApprovalUpdate.jsx'
import EditWrite from './EditWrite.jsx'
import { UserEditablePages, UpdatablePages } from '../../configs/pages.js'
import CustomTableButtons from './CustomTableButtons.jsx'

const Container = styled.div`
    width: 100%;
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    background: #ffffff;
`

const TableWrapper = styled.div`
    border-radius: 8px;
    margin: 0 5px 0 5px;
    
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f3f4f6;
    }
`

const TableSheet = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    font-size: 14px;
`

const THead = styled.thead`
    position: sticky;
    top: 0;
    z-index: 50;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
`

const HeadTr = styled.tr``

const Th = styled.th`
    padding: 10px 12px;
    border: none;
    color: #374151;
    font-weight: 600;
    font-size: 13px;
    text-transform: capitalize;
    cursor: pointer;
    position: relative;
    transition: background 0.2s ease;

    &:hover {
        background: #f3f4f6;
    }

    @media screen and (max-width: 768px) {
        font-size: 11px;
    }
`

const Td = styled.td`
    padding: 10px 12px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
    font-size: 13px;

    @media screen and (max-width: 768px) {
        padding-left: 0px;
        padding-right: 0px;
    }
`

const TBody = styled.tbody`
    background: #ffffff;
`

const BodyTr = styled.tr`
    &:hover td {
        background: #f9fafb;
    }
`

// https://geuni620.github.io/blog/2023/12/2/tanstack-table/
const CustomTable = ({url, columns, data, setData, csvHeaders, fileName}) => {
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
            <CustomTableButtons
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
            {data && data.length > 0 ? (
                <TableWrapper>
                    <TableSheet>
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
                </TableWrapper>
            ) :  (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6, color: '#64748b', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}>📊</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 1 }}>데이터가 없습니다</Typography>
                    <Typography sx={{ fontSize: 14, opacity: 0.7 }}>새로운 데이터를 추가해보세요</Typography>
                </Box>
            )}
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

export default CustomTable