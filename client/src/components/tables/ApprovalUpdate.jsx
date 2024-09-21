import { useState, useMemo } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'
import { EditableSelects } from '../../configs/pages.js'
import { approvalAttendUpdate, approvalPaymentUpdate } from '../../utils/Approval.jsx'
import { attendOptions, paymentOptions } from '../../configs/options.js'
import { attendUpdateColumnHeaders, paymentUpdateColumnHeaders } from '../../configs/approval.js'
import Editor from './Editor'
import { getUser } from '../../storage/userSlice.js'

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
    const previousStatus = rowData.status
    const approvalType = rowData.approvalType
    const options = getOptions(approvalType)
    const columns = getColumns(approvalType)

    const [focus, setFocus] = useState('info')
    const [value, setValue] = useState(rowData)
    const handleClose = () => { setOpen(false) }

    const updateData = () => {
        let tableData = []
        data.map((prev) => (
            prev._id === value._id?tableData.push(value):tableData.push(prev)
        ))
        setData(tableData)
    }

    const handleUpdate = async () => {
        try {
            switch (approvalType) {
                case 'attend':
                    await approvalAttendUpdate(user, previousStatus, value, setValue, updateData)
                    break
                default:
                    await approvalPaymentUpdate(user, previousStatus, value, setValue, updateData)
                    break 
            }
        } catch (err) {
            console.log(err)
        }
        handleClose()
    }

    const handleChange = (event) => {
        setFocus(event.target.name)
        setValue({...value, [event.target.name]: event.target.value})    
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
                                autoFocus={focus===item.accessorKey}
                                select
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                defaultValue={value[item.accessorKey]?value[item.accessorKey]:''}
                                key={index}
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
                                    writeMode={false}
                                    value={value}
                                    setValue={setValue}
                                    isReadOnly={true}
                                /> :
                                <TextField
                                    margin='dense'
                                    id={item.accessorKey}
                                    name={item.accessorKey}
                                    label={item.accessorKey}
                                    fullWidth
                                    variant='standard'
                                    value={rowData[item.accessorKey]?rowData[item.accessorKey]:''}
                                    key={index}
                                    InputProps={{readOnly: true}}
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