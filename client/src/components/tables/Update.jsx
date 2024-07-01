import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { AdminEditableTitles, UserEditableTitles, EditableSelects } from '../../configs/pages.js'
import { options } from '../../configs/options.js'
import { getUser } from '../../storage/userSlice.js'

const getEditableTitles = (user) => {
    let editableTitles = AdminEditableTitles
    if (!user.isAdmin) {
        editableTitles = UserEditableTitles
    }
    return editableTitles
}

const Update = ({writeMode, page, columns, data, setData, open, setOpen, rowData}) => {
    const user = getUser()
    const editableTitles = getEditableTitles(user)

    const [focus, setFocus] = useState('info')
    const [value, setValue] = useState(rowData)
    const handleClose = () => { setOpen(false) }

    const insertData = () => {
        let tableData = [...data]
        let newValue = value 
        tableData.unshift(newValue)
        setData(tableData)
    }

    const updateData = () => {
        let tableData = []
        data.map((prev) => (
            prev._id === value._id?tableData.push(value):tableData.push(prev)
        ))
        setData(tableData)
    }

    const deleteData = () => {
        let tableData = []
        data.map((prev) => (prev._id!==value._id&&tableData.push(prev)))
        setData(tableData)
    }

    const handleUpdate = async () => {
        let url 
        if (writeMode) {
            url = '/api/' + page + '/write'
        } else {
            url = '/api/' + page + '/update'
        }
        try {
            console.log('update', value)
            const res = await axios.post(url, value)
            setValue(res.data)
            if (writeMode) {insertData()}
            else {updateData()}   
        } catch (err) {
            console.log(url, err)
        }
        handleClose()
    }

    const handleDelete = async () => {
        const url = '/api/' + page + '/delete'
        if(!window.confirm('정말로 삭제하시겠습니다.?')) return
        try {
            console.log(value)
            await axios.post(url, value)
            deleteData()
        } catch (err) {
            console.log(url, err)
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
                    } else if (editableTitles.includes(item.accessor) || writeMode){
                        return (
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
                        )
                    } else {
                        return (
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
                <Button onClick={handleUpdate} variant='outlined'>{writeMode?'Write':'Update'}</Button>
                {!writeMode&&(<Button onClick={handleDelete} variant='outlined'>Delete</Button>)}
            </DialogActions>
        </Dialog>
    )
}

export default Update