import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import { EditableSelects } from '../../configs/pages.js'
import { approvalAttendUpdate, approvalPaymentUpdate } from '../../utils/Approval'
import { attendOptions, paymentOptions } from '../../configs/options.js'
import { attendUpdateColumnHeaders, paymentUpdateColumnHeaders } from '../../configs/approval.jsx'

const OPTIONS_MAP = {
    attend: attendOptions,
    payment: paymentOptions,
}

const COLUMNS_MAP = {
    attend: attendUpdateColumnHeaders,
    payment: paymentUpdateColumnHeaders,
}

const ApprovalUpdate = ({ data, setData, open, setOpen, rowData }) => {
    const user = useSelector(state => state.user)
    const { status: previousStatus, approvalType } = rowData
    
    const options = OPTIONS_MAP[approvalType] || paymentOptions
    const columns = COLUMNS_MAP[approvalType] || paymentUpdateColumnHeaders

    const [focus, setFocus] = useState('info')
    const [value, setValue] = useState(rowData)

    const handleClose = () => setOpen(false)

    const updateData = () => {
        const tableData = data.map(prev => prev._id === value._id ? value : prev)
        setData(tableData)
    }

    const handleUpdate = async () => {
        try {
            const updateFunction = approvalType === 'attend' ? approvalAttendUpdate : approvalPaymentUpdate
            await updateFunction(user, previousStatus, value, setValue, updateData)
        } catch (error) {
            console.error(error)
        }
        handleClose()
    }

    const handleChange = (event) => {
        const { name, value: newValue } = event.target
        setFocus(name)
        setValue(prev => ({ ...prev, [name]: newValue }))
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update approval</DialogTitle>
            <DialogContent>
                {columns.map((item, index) => {
                    const isSelect = EditableSelects.includes(item.accessorKey) && options[item.accessorKey]
                    const currentVal = value[item.accessorKey] || ''

                    if (isSelect) {
                        return (
                            <TextField
                                key={index}
                                autoFocus={focus === item.accessorKey}
                                select
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                value={currentVal}
                                onChange={handleChange}
                                autoComplete='off'
                            >
                                {options[item.accessorKey].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )
                    }

                    if (item.accessorKey === 'content') {
                        return (
                            <ReactQuill
                                key={index}
                                theme="snow"
                                value={currentVal}
                                readOnly={true}
                                modules={{ toolbar: false }}
                                style={{ marginTop: '16px', marginBottom: '16px' }}
                            />
                        )
                    }

                    // Read-only fields
                    return (
                        <TextField
                            key={index}
                            margin='dense'
                            id={item.accessorKey}
                            name={item.accessorKey}
                            label={item.accessorKey}
                            fullWidth
                            variant='standard'
                            value={rowData[item.accessorKey] || ''}
                            slotProps={{ input: { readOnly: true } }}
                            autoComplete='off'
                        />
                    )
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                <Button onClick={handleUpdate} variant='outlined'>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ApprovalUpdate