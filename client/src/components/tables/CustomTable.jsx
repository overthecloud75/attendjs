import { useState } from 'react'
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel
} from '@tanstack/react-table'
import {
    Box, Typography, Table, TableHead, TableCell, TableRow, TableBody, Paper, TableContainer
} from '@mui/material'

import Pagination from './Pagination.jsx'
import Update from './UpdateDialog.jsx'
import CardUpdate from './CardUpdate.jsx'
import ApprovalUpdate from './ApprovalUpdate.jsx'
import EditWrite from './EditWrite.jsx'
import CustomTableButtons from './CustomTableButtons.jsx'
import { UserEditablePages, UpdatablePages } from '../../configs/pages.js'

const Td = ({ children, ...props }) => (
    <TableCell
        sx={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: { xs: 12, sm: 13 },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}
        {...props}
    >
        {children}
    </TableCell>
)

const Th = ({ children, ...props }) => (
    <TableCell
        sx={{
            padding: '14px 16px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: { xs: 12, sm: 13 },
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            borderBottom: '2px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            '&:hover': { background: 'var(--hover-bg)' },
            whiteSpace: 'nowrap'
        }}
        {...props}
    >
        {children}
    </TableCell>
)

// https://geuni620.github.io/blog/2023/12/2/tanstack-table/
const CustomTable = ({ page, columns, data, setData, csvHeaders, fileName }) => {
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
            state: { pagination },
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            onPaginationChange: setPagination,
        })

    const handleUpdateClick = (e, rowData) => {
        setSelectedRowData(rowData)
        setWriteMode(false)
        if (UpdatablePages.includes(page)) {
            setOpenUpdate(true)
        } else if (UserEditablePages.includes(page)) {
            setOpenEditWrite(true)
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: { xs: 1, sm: 2 },
                boxSizing: 'border-box', // Ensure padding doesn't affect width
                overflowX: 'hidden' // Prevent horizontal scroll on the outer container
            }}
        >
            <CustomTableButtons
                page={page}
                data={data}
                csvHeaders={csvHeaders}
                fileName={fileName}
                writeMode={writeMode}
                setWriteMode={setWriteMode}
                setOpenEditWrite={setOpenEditWrite}
                setSelectedRowData={setSelectedRowData}
                setOpenUpdate={setOpenUpdate}
            />

            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 3,
                    bgcolor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                }}
            >
                {data && data.length > 0 ? (
                    <TableContainer sx={{ maxHeight: '70vh' }}>
                        <Table stickyHeader aria-label="custom table">
                            <TableHead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        <Th width="60px" align="center">No</Th>
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
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map((row, rowIndex) => (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            transition: 'background-color 0.1s',
                                            '&:hover': {
                                                backgroundColor: 'var(--hover-bg) !important',
                                            },
                                        }}
                                    >
                                        <Td align="center" onClick={(e) => handleUpdateClick(e, row.original)}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'var(--text-secondary)',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    textDecoration: 'none',
                                                    '&:hover': { textDecoration: 'underline', color: '#3b82f6' }
                                                }}
                                            >
                                                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + rowIndex + 1}
                                            </Typography>
                                        </Td>
                                        {row.getVisibleCells().map(cell => (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 8, color: 'var(--text-secondary)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 48, mb: 2, filter: 'grayscale(1)', opacity: 0.5 }}>📊</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', mb: 1 }}>데이터가 없습니다</Typography>
                        <Typography sx={{ fontSize: 14, color: 'var(--text-secondary)' }}>새로운 데이터를 추가하거나 검색 조건을 변경해보세요.</Typography>
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
            </Paper>

            {/* Dialogs */}
            {openUpdate && (page === 'approval' ?
                <ApprovalUpdate
                    data={data}
                    setData={setData}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    rowData={selectedRowData}
                /> : (page === 'creditcard' ?
                    <CardUpdate
                        writeMode={writeMode}
                        page={page}
                        columns={columns}
                        data={data}
                        setData={setData}
                        open={openUpdate}
                        setOpen={setOpenUpdate}
                        rowData={selectedRowData}
                    /> :
                    <Update
                        writeMode={writeMode}
                        page={page}
                        columns={columns}
                        data={data}
                        setData={setData}
                        open={openUpdate}
                        setOpen={setOpenUpdate}
                        rowData={selectedRowData}
                    />
                ))}
            {openEditWrite &&
                <EditWrite
                    writeMode={writeMode}
                    page={page}
                    columns={columns}
                    data={data}
                    setData={setData}
                    open={openEditWrite}
                    setOpen={setOpenEditWrite}
                    rowData={selectedRowData}
                />
            }
        </Box>
    )
}

export default CustomTable