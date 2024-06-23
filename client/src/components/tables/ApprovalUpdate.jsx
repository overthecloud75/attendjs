import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem';
import { EditableSelects } from '../../configs/pages.js'
import { approvalAttendUpdate, approvalPaymentUpdate } from '../../utils/Approval.jsx'
import { attendOptions, paymentOptions } from '../../configs/options.js'
import { attendUpdateColumnHeaders, paymentUpdateColumnHeaders } from '../../configs/approval.js'
import Editor from './Editor'

const getOptions = (approvalType) => {
    let options
    switch (approvalType) {
        case 'attend':
            options = attendOptions
            break 
        case 'payment':
            options = paymentOptions
            break 
        default:
            options = paymentOptions
            break 
    }
    return options 
}

const getColumns = (approvalType) => {
    let coloums
    switch (approvalType) {
        case 'attend':
            coloums = attendUpdateColumnHeaders
            break 
        case 'payment':
            coloums = paymentUpdateColumnHeaders
            break 
        default:
            coloums = paymentUpdateColumnHeaders
            break 
    }
    return coloums
}

const ApprovalUpdate = ({data, setData, open, setOpen, rowData}) => {
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
                    await approvalAttendUpdate(previousStatus, value, setValue, updateData)
                    break
                default:
                    await approvalPaymentUpdate(previousStatus, value, setValue, updateData)
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
                    if (EditableSelects.includes(item.accessor)&&options[item.accessor]) {
                        return (
                            <TextField
                                autoFocus={focus===item.accessor}
                                select
                                margin='dense'
                                id={item.accessor}
                                name={item.accessor}
                                label={item.accessor}
                                fullWidth
                                variant='outlined'
                                defaultValue={value[item.accessor]?value[item.accessor]:''}
                                key={index}
                                onChange={handleChange}
                                autoComplete='false'
                            >  
                                {options[item.accessor].map((option) => (
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
                            item.accessor==='content'?
                                <Editor
                                    writeMode={false}
                                    value={value}
                                    setValue={setValue}
                                    isReadOnly={true}
                                /> :
                                <TextField
                                    margin='dense'
                                    id={item.accessor}
                                    name={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='standard'
                                    value={rowData[item.accessor]?rowData[item.accessor]:''}
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