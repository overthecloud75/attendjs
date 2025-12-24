import { useState, useEffect, useRef, useMemo } from 'react'
import dayjs from 'dayjs'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import axios from 'axios'
import { CardEditableTitles, CardEditableSelects } from '../../configs/pages.js'
import { options } from '../../configs/options.js'
import { getToday } from '../../utils/DateUtil'
import { getCreditCardNo } from '../../utils/EventUtil'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const CardUpdate = ({ writeMode, page, columns, data, setData, open, setOpen, rowData }) => {
    const [focus, setFocus] = useState('info')
    const [value, setValue] = useState(rowData.date ? { ...rowData } : { ...rowData, date: getToday() })
    const handleClose = () => { setOpen(false) }

    const quillRef = useRef(null)

    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/png, image/jpeg, image/webp')
        input.click()

        input.onchange = async () => {
            const file = input.files[0]
            if (!file) return

            // MIME check
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
                alert('지원되지 않는 이미지 형식입니다. (png, jpeg, webp만 가능)')
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('이미지 크기는 5MB 이하여야 합니다.')
                return
            }

            const formData = new FormData()
            formData.append('file', file)

            try {
                const res = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                const range = quillRef.current.getEditor().getSelection()
                const url = res.data.url
                quillRef.current.getEditor().insertEmbed(range.index, 'image', url)
            } catch (err) {
                console.error(err)
                alert('이미지 업로드에 실패했습니다.')
            }
        }
    }

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['image']
                ],
                handlers: {
                    image: imageHandler
                }
            }
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await getCreditCardNo()
            if (!error) {
                setValue({ ...value, cardNo: data.cardNo })
            }
        }
        if (writeMode) { fetchData() }
        // eslint-disable-next-line
    }, [open])

    const checkValue = () => {
        if (!value.date) {
            alert('사용일이 작성되지 않습니다.')
            return false
        }
        if (value.date > dayjs(new Date()).format('YYYY-MM-DD')) {
            alert('사용일은 당일 이후 날짜는 가능하지 않습니다.')
            return false
        }
        if (!value.cardNo) {
            alert('카드번호가 작성되지 않았습니다.')
            return false
        }
        if (!value.use) {
            alert('사용내용이 작성되지 않습니다.')
            return false
        }
        if (!window.confirm('정말로 저장하시겠습니까?')) return false
        return true
    }

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
        const valueStatus = checkValue()
        if (!valueStatus) return
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
        if (!window.confirm('정말로 삭제하시겠습니다?')) return
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

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Update {page}</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label='사용일'
                            format={'YYYY-MM-DD'}
                            value={dayjs(value.date)}
                            onChange={(newValue) => setValue({ ...value, date: newValue.format('YYYY-MM-DD') })}
                            sx={{ width: '100%' }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                {columns.map((item, index) => {
                    if (CardEditableSelects.includes(item.accessorKey) && options[item.accessorKey]) {
                        return (
                            <TextField
                                autoFocus={focus === item.accessorKey}
                                select
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                defaultValue={value[item.accessorKey] ? value[item.accessorKey] : ''}
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
                    } else if (CardEditableTitles.includes(item.accessorKey)) {
                        return (
                            <TextField
                                autoFocus={focus === item.accessorKey}
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='outlined'
                                value={value[item.accessorKey] ? value[item.accessorKey] : ''}
                                key={index}
                                onChange={handleChange}
                                autoComplete='false'
                            />
                        )
                    } else if (item.accessorKey !== 'date') {
                        return (
                            <TextField
                                margin='dense'
                                id={item.accessorKey}
                                name={item.accessorKey}
                                label={item.accessorKey}
                                fullWidth
                                variant='standard'
                                value={value[item.accessorKey] ? value[item.accessorKey] : ''}
                                key={index}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                                autoComplete='false'
                            />
                        )
                    }
                })}
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value.content || ''}
                    onChange={(content) => setValue({ ...value, content })}
                    readOnly={!writeMode}
                    modules={writeMode ? modules : { toolbar: false }}
                    placeholder='여기에 영수증 사진을 upload 해주세요.'
                    style={{ height: '300px', marginBottom: '50px', marginTop: '20px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                <Button onClick={handleUpdate} variant='outlined'>{writeMode ? 'Write' : 'Update'}</Button>
                {!writeMode && (<Button onClick={handleDelete} variant='outlined'>Delete</Button>)}
            </DialogActions>
        </Dialog>
    )
}

export default CardUpdate