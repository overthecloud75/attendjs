import { useState, useMemo } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'
import { EditableSelects } from '../../configs/pages.js'
import { approvalAttendUpdate, approvalPaymentUpdate } from '../../utils/Approval'
import { attendOptions, paymentOptions } from '../../configs/options.js'
import { attendUpdateColumnHeaders, paymentUpdateColumnHeaders } from '../../configs/approval.jsx'
import Editor from './Editor'
import { getUser } from '../../storage/userSlice'

const getOptions = (approvalType) => {
    switch (approvalType) {
        case 'attend':
            return attendOptions
        case 'payment':
            return paymentOptions
        default:
            return paymentOptions
    }
}

const getColumns = (approvalType) => {
    switch (approvalType) {
        case 'attend':
            return attendUpdateColumnHeaders
        case 'payment':
            return paymentUpdateColumnHeaders
        default:
            return paymentUpdateColumnHeaders
    }
}

const ApprovalUpdate = ({data, setData, open, setOpen, rowData}) => {
    const user = useMemo(() => getUser(), [])
    const { status: previousStatus, approvalType } = rowData
    const options = getOptions(approvalType)
    const columns = getColumns(approvalType)

    const [focus, setFocus] = useState('info')
    const [value, setValue] = useState(rowData)
    
    const handleClose = () => { setOpen(false) }

    const updateData = () => {
        const tableData = data.map(prev => 
            prev._id === value._id ? value : prev
        )
        setData(tableData)
    }

    const handleUpdate = async () => {
        try {
            const updateFunction = approvalType === 'attend' 
                ? approvalAttendUpdate 
                : approvalPaymentUpdate
            await updateFunction(user, previousStatus, value, setValue, updateData)
        } catch (error) {
            console.log(error)
        }
        handleClose()
    }

    const handleChange = (event) => {
        const { name, value: newValue } = event.target
        setFocus(name)
        setValue(prev => ({...prev, [name]: newValue}))    
    }
    // autofocus disappear after typing, 한글 입력 문제 
    // https://stackoverflow.com/questions/42573017/in-react-es6-why-does-the-input-field-lose-focus-after-typing-a-character

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update approval</DialogTitle>
            <DialogContent>
                {columns.map((item, index) => {
                    if (EditableSelects.includes(item.accessorKey)&&options[item.accessorKey]) {
                        return (
                            <TextField
                                key={index}
                                autoFocus={focus===item.accessorKey}
                                select
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                defaultValue={value[item.accessorKey]?value[item.accessorKey]:''}
                                onChange={handleChange}
                                autoComplete='false'
                            >  
                                {options[item.accessorKey].map((option) => (
                                    <MenuItem
                                        key={option} 
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )
                    } else {
                        return (
                            item.accessorKey==='content'?
                                <Editor
                                    key={index}
                                    writeMode={false}
                                    value={value}
                                    setValue={setValue}
                                    isReadOnly={true}
                                /> :
                                <TextField
                                    key={index}
                                    margin='dense'
                                    id={item.accessorKey}
                                    name={item.accessorKey}
                                    label={item.accessorKey}
                                    fullWidth
                                    variant='standard'
                                    value={rowData[item.accessorKey]?rowData[item.accessorKey]:''}
                                    slotProps={{
                                        input: {
                                          readOnly: true,
                                        },
                                    }}
                                    autoComplete='false'
                                />
                        )
                    }
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