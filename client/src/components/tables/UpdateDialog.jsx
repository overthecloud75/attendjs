import { useState, useMemo } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, InputAdornment } from '@mui/material'
import { Save, Trash2, X, Edit, Plus, User, Mail, Phone, Briefcase, List, Lock, Calendar, Hash } from 'lucide-react'
import axios from 'axios'
import { AdminEditableTitles, UserEditableTitles, EditableSelects } from '../../configs/pages.js'
import { options } from '../../configs/options.js'
import { useAuth } from '../../hooks/useAuth'

const getEditableTitles = (user) => user.isAdmin ? AdminEditableTitles : UserEditableTitles

const Update = ({ writeMode, page, columns, data, setData, open, setOpen, rowData }) => {
    const { user } = useAuth()
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
            prev._id === value._id ? tableData.push(value) : tableData.push(prev)
        ))
        setData(tableData)
    }

    const deleteData = () => {
        let tableData = []
        data.map((prev) => (prev._id !== value._id && tableData.push(prev)))
        setData(tableData)
    }

    const handleUpdate = async () => {
        const url = `/api/${page}/${writeMode ? 'write' : 'update'}`
        try {
            const res = await axios.post(url, value)
            setValue(res.data)
            if (writeMode) { insertData() }
            else { updateData() }
        } catch (err) {
            console.log(url, err)
        }
        handleClose()
    }

    const handleDelete = async () => {
        if (!window.confirm('정말로 삭제하시겠습니다.?')) return
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
        setValue({ ...value, [event.target.name]: event.target.value })
    }
    // autofocus disappear after typing, 한글 입력 문제 
    // https://stackoverflow.com/questions/42573017/in-react-es6-why-does-the-input-field-lose-focus-after-typing-a-character

    const Actions = (
        <>
            <Button
                onClick={handleClose}
                variant='outlined'
                sx={{ 
                    flex: { xs: 1, sm: 'none' },
                    color: 'var(--text-secondary)', 
                    borderColor: 'var(--border-color)', 
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'var(--bg-secondary)', borderColor: 'var(--text-secondary)' } 
                }}
                startIcon={<X size={18} />}
            >
                취소
            </Button>
            {!writeMode &&
                (<Button
                    onClick={handleDelete}
                    variant='outlined'
                    color="error"
                    sx={{ 
                        flex: { xs: 1, sm: 'none' },
                        borderColor: 'var(--danger)', 
                        color: 'var(--danger)',
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'var(--bg-active)', borderColor: 'var(--danger)' } 
                    }}
                    startIcon={<Trash2 size={18} />}
                >
                    삭제
                </Button>)
            }
            <Button
                onClick={handleUpdate}
                variant='contained'
                sx={{ 
                    flex: { xs: 1, sm: 'none' },
                    bgcolor: 'var(--text-active)', 
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'var(--text-active)', opacity: 0.9 } 
                }}
                startIcon={<Save size={18} />}
            >
                {writeMode ? '생성' : '수정'}
            </Button>
        </>
    )

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={writeMode ? `${page} 생성` : `${page} 수정`}
            titleIcon={writeMode ? <Plus size={20} /> : <Edit size={20} />}
            actions={Actions}
            maxWidth="sm"
        >
            {columns.map((item, index) => {
                if (EditableSelects.includes(item.accessorKey) && options[item.accessorKey]) {
                    return (
                        <TextField
                            autoFocus={focus === item.accessorKey}
                            select
                            margin='dense'
                            id={item.accessorKey}
                            name={item.accessorKey}
                            label={item.header || item.accessorKey}
                            fullWidth
                            variant='outlined'
                            defaultValue={value[item.accessorKey] ? value[item.accessorKey] : ''}
                            key={index}
                            onChange={handleChange}
                            autoComplete='false'
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--text-primary)',
                                    '& fieldset': { borderColor: 'var(--border-color)' },
                                    '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--text-active)' }
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--text-active)' },
                                '& .MuiSelect-icon': { color: 'var(--text-secondary)' }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <List size={18} style={{ color: 'var(--text-secondary)' }} />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        >
                            {options[item.accessorKey].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    )
                } else if (editableTitles.includes(item.accessorKey) || writeMode) {
                    return (
                        <TextField
                            autoFocus={focus === item.accessorKey}
                            margin='dense'
                            id={item.accessorKey}
                            name={item.accessorKey}
                            label={item.header || item.accessorKey}
                            fullWidth
                            variant='outlined'
                            value={value[item.accessorKey] ? value[item.accessorKey] : ''}
                            key={index}
                            onChange={handleChange}
                            autoComplete='false'
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--text-primary)',
                                    '& fieldset': { borderColor: 'var(--border-color)' },
                                    '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--text-active)' }
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--text-active)' }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {['email'].includes(item.accessorKey) && <Mail size={18} style={{ color: 'var(--text-secondary)' }} />}
                                            {['phone', 'phoneNumber'].includes(item.accessorKey) && <Phone size={18} style={{ color: 'var(--text-secondary)' }} />}
                                            {['name', 'username'].includes(item.accessorKey) && <User size={18} style={{ color: 'var(--text-secondary)' }} />}
                                            {['department', 'rank', 'position'].includes(item.accessorKey) && <Briefcase size={18} style={{ color: 'var(--text-secondary)' }} />}
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    )
                } else {
                    return (
                        <TextField
                            margin='dense'
                            id={item.accessorKey}
                            name={item.accessorKey}
                            label={item.header || item.accessorKey}
                            fullWidth
                            variant='standard'
                            value={rowData[item.accessorKey] ? rowData[item.accessorKey] : ''}
                            key={index}
                            autoComplete='false'
                            sx={{ mt: 2 }}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {['createdAt', 'updatedAt'].includes(item.accessorKey) ?
                                                <Calendar size={18} style={{ color: 'var(--text-secondary)' }} /> :
                                                (['_id', 'id'].includes(item.accessorKey) ?
                                                    <Hash size={18} style={{ color: 'var(--text-secondary)' }} /> :
                                                    <Lock size={18} style={{ color: 'var(--text-secondary)' }} />
                                                )
                                            }
                                        </InputAdornment>
                                    ),
                                    sx: { color: 'var(--text-secondary)' }
                                },
                                inputLabel: { sx: { color: 'var(--text-secondary)' } }
                            }}
                        />
                    )
                }
            })}
        </BaseDialog>
    )
}

export default Update