import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { format } from 'date-fns'
import { getUser } from '../storage/userSlice.js'
import { postUpload } from '../utils/UploadUtil'

const EditWrite = ({writeMode, page, columns, data, setData, open, setOpen, rowData}) => {
    
    const user = getUser()
    const [focus, setFocus] = useState('name')
    const [value, setValue] = useState(writeMode?{id: '', name: user.name, title: '', content: ''}:rowData)
    const [flag, setFlag] = useState(false)
    // eslint-disable-next-line
    const [image, setImage] = useState('')
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
            window.alert('내용이 작성되지 않았습니다.')
            return false
        }
        if (!value.title) {
            window.alert('제목이 작성되지 않았습니다.')
            return false
        }
        if (!window.confirm('정말로 저장하시겠습니다.?')) return false
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

    const handleEditReady = (editor) => {
        if (writeMode) {setValue({...value, id: editor.id})}
        editor.editing.view.change((writer) => {
            writer.setStyle('min-height', '400px', editor.editing.view.document.getRoot())
        })
    }
   
    const handleEditChange = (e, editor) => {
        setValue({...value, content: editor.getData()})
    }

    const handleUpdate = async () => {
        const valueStatus = checkValue()
        if (!valueStatus) return 

        let url 
        if (writeMode) {
            url = '/api/' + page + '/write'
        } else {
            url = '/api/' + page + '/update'
        }
        try {
            const res = await axios.post(url, value)
            setValue(res.data)
            if (writeMode) {insertData()}
            else {updateData()}
        } catch (err) {
            window.alert(err)
        }
        handleClose()
    }

    const handleDelete = async () => {
        const url = '/api/' + page + '/delete'
        if(!window.confirm('정말로 삭제하시겠습니다.?')) return
        try {
            await axios.post(url, value)
            deleteData()
        } catch (err) {
            window.alert(err)
        }
        handleClose()
    }
     
    const imageUploadAdapter = (loader) => {
        const imgLink = '/api/upload/image'
        return {
            upload: async () => {
                try {
                    const file = await loader.file;
                    const result = await postUpload(file)
                    if (!result.err) {
                        if (!flag) {
                            setFlag(true)
                            setImage(result.resData.filename)
                        }
                        return {
                            default: `${imgLink}/${result.resData.filename}`
                        }
                    } else {
                        throw result.err
                    }
                } catch (error) {
                    console.error('Error uploading file:', error)
                }
            }
        }
    }

    function uploadImagePlugin(editor) { 
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return imageUploadAdapter(loader)
        }
    }
   
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
            <DialogTitle>Write {page}</DialogTitle>
            <DialogContent>
                {columns.map((item, index) => {
                    return ( 
                        value[item.accessor]!==undefined&& 
                            (['createdAt', 'updatedAt', 'name'].includes(item.accessor)?(
                                <TextField
                                    autoFocus={focus===item.accessor}
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='standard'
                                    value={value[item.accessor]?value[item.accessor]:''}
                                    key={index}
                                    InputProps={{readOnly: true}}
                                    
                                />
                            ):(
                                <TextField
                                    autoFocus={focus===item.accessor}
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='outlined'
                                    value={value[item.accessor]?value[item.accessor]:''}
                                    key={index}
                                    onChange={handleInputChange}
                                />
                            )

                        )
                    )
                })}
                <CKEditor
                    editor={ ClassicEditor }
                    config={{ 
                        extraPlugins: [uploadImagePlugin]
                    }}
                    data={ value.content }
                    onReady={ editor => handleEditReady(editor)}
                    onChange={ (e, editor) => handleEditChange(e, editor)}
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