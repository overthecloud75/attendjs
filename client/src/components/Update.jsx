import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { EditablePages, AdminEditableTitles, UserEditableTitles, EditableSelects } from '../configs/pages'
import { getToday } from '../utils/DateUtil'
import { options } from '../configs/options'
import { getUser } from '../storage/userSlice.js'

const getEditableTitles = (user) => {
    let editableTitles = AdminEditableTitles
    if (!user.isAdmin) {
        editableTitles = UserEditableTitles
    }
    return editableTitles
}

const Update = ({page, columns, data, setData, open, setOpen, rowData}) => {

    const user = getUser()
    const editableTitles = getEditableTitles(user)
    const previousStatus = rowData.status
    const navigate = useNavigate()

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
        const url = '/api/' + page + '/update'
        if (EditablePages.includes(page)) {
            try {
                if (page === 'approval') {
                    if (previousStatus === value.status) { 
                        alert('status가 바뀌지 않았습니다.')
                        navigate('/approvalhistory')
                    } else if (user.isAdmin) {
                        if (previousStatus === 'Pending' || (previousStatus === 'Active' && value.status === 'Cancel')) {
                            const res = await axios.post(url, value)
                            setValue(res.data)
                            updateData()
                        } else {
                            alert('변경할 수 없는 조건입니다.')
                            navigate('/approvalhistory')
                        }     
                    } else if ((previousStatus === 'Pending' && value.status === 'Cancel') ||
                        (previousStatus === 'Active' && value.status === 'Cancel' && value.start) > getToday()) {
                        const res = await axios.post(url, value)
                        setValue(res.data)
                        updateData()
                    } else {
                        alert('변경할 수 없는 조건입니다.')
                        navigate('/approvalhistory')
                    }
                } else {
                    const res = await axios.post(url, value)
                    setValue(res.data)
                    updateData()
                }
            } catch (err) {
                console.log(url, err)
            }
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
            <DialogTitle>Update {page}</DialogTitle>
            <DialogContent>
                {columns.map((item, index) => {
                    return (
                        EditableSelects.includes(item.accessor)?(
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
                        ):editableTitles.includes(item.accessor)?(
                            <TextField
                                autoFocus={focus===item.accessor}
                                margin='dense'
                                id={item.accessor}
                                name={item.accessor}
                                label={item.accessor}
                                fullWidth
                                variant='outlined'
                                value={value[item.accessor]?value[item.accessor]:''}
                                key={index}
                                onChange={handleChange}
                                autoComplete='false'
                            />
                        ):(
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

export default Update