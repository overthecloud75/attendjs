import { useState } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import axios from 'axios'
import { format } from 'date-fns'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { User, Type, Calendar, Save, Trash2, X, PenTool, Edit } from 'lucide-react'
import { InputAdornment } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

const EditWrite = ({ writeMode, page, columns, data, setData, open, setOpen, rowData }) => {

    const { user } = useAuth()
    const [focus, setFocus] = useState('name')
    const [value, setValue] = useState(writeMode ? {
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
        data.map((prev) => (prev._id === value._id ? tableData.push(newValue) : tableData.push(prev)))
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
        data.map((prev) => (prev._id !== value._id && tableData.push(prev)))
        setData(tableData)
    }

    const handleInputChange = (e) => {
        setFocus(e.target.id)
        setValue({ ...value, [e.target.id]: e.target.value })
    }

    const handleUpdate = async () => {
        if (!checkValue()) return
        const url = `/api/${page}/${writeMode ? 'write' : 'update'}`
        try {
            const res = await axios.post(url, value)
            setValue(res.data)
            if (writeMode) { insertData() }
            else { updateData() }
        } catch (err) {
            alert(err)
        }
        handleClose()
    }

    const handleDelete = async () => {
        if (!window.confirm('정말로 삭제하시겠습니까?')) return
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
            <DialogTitle sx={{ bgcolor: 'var(--card-bg)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 1 }}>
                {writeMode ? <PenTool size={20} /> : <Edit size={20} />}
                {writeMode ? '글 작성' : '글 수정'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'var(--card-bg)', color: 'var(--text-primary)', pt: 3 }}>
                {columns.map((item, index) => {
                    return (
                        value[item.accessorKey] !== undefined &&
                        (['createdAt', 'updatedAt', 'name'].includes(item.accessorKey) ? (
                            <TextField
                                autoFocus={focus === item.accessorKey}
                                margin='dense'
                                id={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='standard'
                                value={value[item.accessorKey] ? value[item.accessorKey] : ''}
                                key={index}
                                sx={{ mt: 2 }}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {['createdAt', 'updatedAt'].includes(item.accessorKey) ?
                                                    <Calendar size={18} style={{ color: 'var(--text-secondary)' }} /> :
                                                    <User size={18} style={{ color: 'var(--text-secondary)' }} />
                                                }
                                            </InputAdornment>
                                        ),
                                        sx: { color: 'var(--text-secondary)' }
                                    },
                                    inputLabel: { sx: { color: 'var(--text-secondary)' } }
                                }}
                            />
                        ) : (
                            <TextField
                                autoFocus={focus === item.accessorKey}
                                margin='dense'
                                id={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                value={value[item.accessorKey] ? value[item.accessorKey] : ''}
                                key={index}
                                onChange={handleInputChange}
                                sx={{
                                    mt: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'var(--text-primary)',
                                        '& fieldset': { borderColor: 'var(--border-color)' },
                                        '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                    },
                                    '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {item.accessorKey === 'title' && <Type size={18} style={{ color: 'var(--text-secondary)' }} />}
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        )

                        )
                    )
                })}
                <ReactQuill
                    theme="snow"
                    value={value.content || ''}
                    onChange={(content) => setValue({ ...value, content })}
                    placeholder="여기에 내용을 입력하세요..."
                    style={{ height: '300px', marginBottom: '50px', marginTop: '20px', color: 'var(--text-primary)' }}
                />
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
                {!writeMode &&
                    (<Button
                        onClick={handleDelete}
                        variant='outlined'
                        color="error"
                        sx={{ borderColor: 'error.main', '&:hover': { bgcolor: 'error.light', color: 'white', borderColor: 'error.main' } }}
                        startIcon={<Trash2 size={18} />}
                    >
                        삭제
                    </Button>)
                }
                <Button
                    onClick={handleUpdate}
                    variant='contained'
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                    startIcon={<Save size={18} />}
                >
                    {writeMode ? '작성' : '수정'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditWrite