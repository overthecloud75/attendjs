import { useState, useMemo } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import axios from 'axios'
import { format } from 'date-fns'
import { getUser } from '../../storage/userSlice'
import Editor from './Editor'

const EditWrite = ({writeMode, page, columns, data, setData, open, setOpen, rowData}) => {
    
    const user = useMemo(() => getUser(), [])
    const [focus, setFocus] = useState('name')
    const [value, setValue] = useState(writeMode?{
        id: '', 
        name: user.name, 
        title: '', 
        content: ''
    } : rowData)
    const handleClose = () => { setOpen(false) }

    const insertData = () => {
        let tableData = [...data]
        let newValue = value 
        const timestamp = new Date()
        newValue.createdAt = format(timestamp, 'yy-MM-dd HH:mm:ss')
        newValue.updatedAt = format(timestamp, 'yy-MM-dd HH:mm:ss')
        tableData.unshift(newValue)
        setData(tableData)
    }

    const updateData = () => {
        let tableData = []
        let newValue = value
        const timestamp = new Date()
        newValue.updatedAt = format(timestamp, 'yy-MM-dd HH:mm:ss')
        data.map((prev) => (prev._id===value._id?tableData.push(newValue):tableData.push(prev)))
        setData(tableData)
    }

    const checkValue = () => {
        if (!value.content) {
            alert('내용이 작성되지 않았습니다.')
            return false
        }
        if (!value.title) {
            alert('제목이 작성되지 않았습니다.')
            return false
        }
        if (!window.confirm('정말로 저장하시겠습니까?')) return false
        return true
    }

    const deleteData = () => {
        let tableData = []
        data.map((prev) => (prev._id!==value._id&&tableData.push(prev)))
        setData(tableData)
    }

    const handleInputChange = (e) => {
        setFocus(e.target.id)
        setValue({...value, [e.target.id]: e.target.value})    
    }

    const handleUpdate = async () => {
        if (!checkValue()) return 
        const url = `/api/${page}/${writeMode ? 'write' : 'update'}`
        try {
            const res = await axios.post(url, value)
            setValue(res.data)
            if (writeMode) {insertData()}
            else {updateData()}
        } catch (err) {
            alert(err)
        }
        handleClose()
    }

    const handleDelete = async () => {
        if(!window.confirm('정말로 삭제하시겠습니까?')) return
        const url = `/api/${page}/delete`
        try {
            await axios.post(url, value)
            deleteData()
        } catch (err) {
            alert(err)
        }
        handleClose()
    }
     
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
            <DialogTitle>Write {page}</DialogTitle>
            <DialogContent>
                {columns.map((item, index) => {
                    return ( 
                        value[item.accessorKey]!==undefined&& 
                            (['createdAt', 'updatedAt', 'name'].includes(item.accessorKey)?(
                                <TextField
                                    autoFocus={focus===item.accessorKey}
                                    margin='dense'
                                    id={item.accessorKey}
                                    label={item.accessorKey}
                                    fullWidth
                                    variant='standard'
                                    value={value[item.accessorKey]?value[item.accessorKey]:''}
                                    key={index}
                                    InputProps={{readOnly: true}}                   
                                />
                            ):(
                                <TextField
                                    autoFocus={focus===item.accessorKey}
                                    margin='dense'
                                    id={item.accessorKey}
                                    label={item.accessorKey}
                                    fullWidth
                                    variant='outlined'
                                    value={value[item.accessorKey]?value[item.accessorKey]:''}
                                    key={index}
                                    onChange={handleInputChange}
                                />
                            )

                        )
                    )
                })}
                <Editor
                    writeMode={writeMode}
                    value={value}
                    setValue={setValue}
                    isReadOnly={false}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                <Button onClick={handleUpdate} variant='outlined'>{writeMode?'Write':'Update'}</Button>
                {!writeMode&&
                    (<Button onClick={handleDelete} variant='outlined'>Delete</Button>)
                }
            </DialogActions>
        </Dialog>
    )
}

export default EditWrite