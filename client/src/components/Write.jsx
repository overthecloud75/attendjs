import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { format } from 'date-fns'

const Write = ({UpdatePages, writeMode, page, columns, data, setData, open, setOpen, rowData}) => {
 
    const [focus, setFocus] = useState('name')
    const [value, setValue] = useState(
        writeMode?{id: '', name: '', title: '', content: ''
        }:rowData
    )
    const [content, setContent] = useState(value.content)
    const handleClose = () => {setOpen(false)}

    const insertData = () => {
        let tableData = [...data]
        let newValue = value 
        const timestamp = new Date()
        newValue.createdAt = format(timestamp, "yy-MM-dd HH:mm:ss")
        newValue.updatedAt = format(timestamp, "yy-MM-dd HH:mm:ss")
        tableData.unshift(newValue)
        setData(tableData)
    }

    const updateData = () => {
        let tableData = []
        let newValue = value
        const timestamp = new Date()
        newValue.updatedAt = format(timestamp, "yy-MM-dd HH:mm:ss")
        data.map((prev) => (prev.id=== value.id?tableData.push(newValue):tableData.push(prev)))
        setData(tableData)
    }

    const deleteData = () => {
        let tableData = []
        data.map((prev) => (prev.id!== value.id&&tableData.push(prev)))
        setData(tableData)
    }

    const handleInputChange = (e) => {
        setFocus(e.target.id)
        setValue({...value, [e.target.id]: e.target.value})    
    }

    const handleEditReady = (editor) => {
        if (writeMode) {setValue({...value, id: editor.id})}
        else {editor.id = rowData.id}
        editor.editing.view.change((writer) => {
            writer.setStyle('min-height', '400px', editor.editing.view.document.getRoot())
        })
    }
   
    const handleEditChange = (e, editor) => {
        setContent(editor.getData())
        setValue({...value, content: editor.getData()})
    }

    const handleUpdate = async () => {
        const url = '/api/' + page + '/write'
        if (UpdatePages.includes(page)) {
            if(!window.confirm('정말로 저장하시겠습니다.?')) return
            try {
                await axios.post(url, value)
                if (writeMode) {insertData()}
                else {updateData()}
            } catch (err) {
                console.log(url, err)
            }
        }
        handleClose()
    }

    const handleDelete = async () => {
        const url = '/api/' + page + '/delete'
        if (UpdatePages.includes(page)) {
            if(!window.confirm('정말로 삭제하시겠습니다.?')) return
            try {
                await axios.post(url, value)
                deleteData()
            } catch (err) {
                console.log(url, err)
            }
        }
        handleClose()
    }
   
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
            <DialogTitle>Write {page}</DialogTitle>
            <DialogContent>
                {columns.map((item, index) => {
                    return ( 
                        value[item.accessor]!== undefined && (
                            !['createdAt', 'updatedAt'].includes(item.accessor)?(
                                <TextField
                                    autoFocus={focus===item.accessor?true:false}
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='outlined'
                                    value={value[item.accessor]?value[item.accessor]:''}
                                    key={index}
                                    onChange={handleInputChange}
                                />
                            ):(
                                <TextField
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='standard'
                                    value={rowData[item.accessor]?rowData[item.accessor]:''}
                                    key={index}
                                    InputProps={{readOnly: true}}
                                />
                            )

                        )
                    )
                })}
                <CKEditor
                    editor={ ClassicEditor }
                    data={ content }
                    onReady={ editor => handleEditReady(editor)}
                    onChange={ (e, editor) => handleEditChange(e, editor)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                <Button onClick={handleUpdate} variant='outlined'>Update</Button>
                {!writeMode&&
                    (<Button onClick={handleDelete} variant='outlined'>Delete</Button>)
                }
            </DialogActions>
        </Dialog>
    )
}

export default Write