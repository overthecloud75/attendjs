import { useState } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, InputAdornment } from '@mui/material'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { Edit, Save, X, List, FileText, User, Calendar, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

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
    const { user } = useAuth()
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ bgcolor: 'var(--card-bg)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Edit size={20} />
                결재 수정
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'var(--card-bg)', color: 'var(--text-primary)', pt: 3 }}>
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
                                sx={{
                                    mt: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'var(--text-primary)',
                                        '& fieldset': { borderColor: 'var(--border-color)' },
                                        '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                    },
                                    '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                                    '& .MuiSelect-icon': { color: 'var(--text-secondary)' }
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <List size={18} style={{ color: 'var(--text-secondary)' }} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
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
                                style={{ marginTop: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}
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
                            sx={{ mt: 2 }}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {['createdAt', 'updatedAt', 'date'].includes(item.accessorKey) ?
                                                <Calendar size={18} style={{ color: 'var(--text-secondary)' }} /> :
                                                (['user', 'name'].includes(item.accessorKey) ?
                                                    <User size={18} style={{ color: 'var(--text-secondary)' }} /> :
                                                    <FileText size={18} style={{ color: 'var(--text-secondary)' }} />
                                                )
                                            }
                                        </InputAdornment>
                                    ),
                                    sx: { color: 'var(--text-secondary)' }
                                },
                                inputLabel: { sx: { color: 'var(--text-secondary)' } }
                            }}
                            autoComplete='off'
                        />
                    )
                })}
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
                <Button
                    onClick={handleClose}
                    variant='outlined'
                    sx={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)', '&:hover': { bgcolor: 'var(--bg-secondary)', borderColor: 'var(--text-secondary)' } }}
                    startIcon={<X size={18} />}
                >
                    취소
                </Button>
                <Button
                    onClick={handleUpdate}
                    variant='contained'
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                    startIcon={<Save size={18} />}
                >
                    수정
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ApprovalUpdate