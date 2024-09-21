import { useState, useMemo } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'
import axios from 'axios'
import { AdminEditableTitles, UserEditableTitles, EditableSelects } from '../../configs/pages.js'
import { options } from '../../configs/options.js'
import { getUser } from '../../storage/userSlice.js'

const getEditableTitles = (user) => user.isAdmin ? AdminEditableTitles : UserEditableTitles

const Update = ({writeMode, page, columns, data, setData, open, setOpen, rowData}) => {
    const user = useMemo(() => getUser(), [])
    const editableTitles = useMemo(() => getEditableTitles(user), [user])

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
        const url = `/api/${page}/${writeMode ? 'write' : 'update'}`
        try {
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
        if(!window.confirm('정말로 삭제하시겠습니다.?')) return
        const url = `/api/${page}/delete`
        try {
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
                    } else if (editableTitles.includes(item.accessorKey) || writeMode){
                        return (
                            <TextField
                                autoFocus={focus===item.accessorKey}
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                value={value[item.accessorKey]?value[item.accessorKey]:''}
                                key={index}
                                onChange={handleChange}
                                autoComplete='false'
                            />
                        )
                    } else {
                        return (
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
                <Button onClick={handleUpdate} variant='outlined'>{writeMode?'Write':'Update'}</Button>
                {!writeMode&&(<Button onClick={handleDelete} variant='outlined'>Delete</Button>)}
            </DialogActions>
        </Dialog>
    )
}

export default Update