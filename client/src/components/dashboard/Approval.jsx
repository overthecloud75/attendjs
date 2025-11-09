import { useState } from 'react'
import dayjs from 'dayjs'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Stack} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import { postApproval } from '../../utils/EventUtil'
import { WORKING } from '../../configs/working'
import { LoadingSpinner } from '../../utils/GeneralUtil'
import { useApproval } from '../../hooks/useApproval'

const options = Object.keys(WORKING.outStatus)
const halfOptions = WORKING.outStatus['반차']

const validateApproval = (value) => {
    if (value.reason === '출근' && value.end >= dayjs(new Date()).format('YYYY-MM-DD')) {
        alert('출근 신청은 당일 이전 날짜에서만 가능합니다.')
        return false
    } else if (value.reason === '기타' && value.etc.length === 0) {
        alert('사유를 적어 주세요.')
        return false 
    }
    return window.confirm('정말로 상신하시겠습니다.?')
}

const Approval = ({navigate, open, setOpen}) => {
    const {t} = useTranslation()
    const [etcOpen, setEtcOpen] = useState(false)

    const { value, setValue, leftLeave, leftStatus } = useApproval() 

    const handleClose = () => { setOpen(false) }

    const handleUpdate = async () => {
        if (!validateApproval(value)) return 
        await postApproval(value)
        setOpen(false)
        navigate('/approvalhistory')
    }

    const handleChange = (event) => {
        const { name, value: inputValue } = event.target
        if (name === 'reason' && inputValue === '반차') {
            setEtcOpen(true)
        } else if (name === 'reason' && inputValue === '기타') {
            setEtcOpen(true)
        } else if (name === 'etc') {
            if (inputValue.length > 10) return alert('10글자 이하로 적어주세요.')
            if (/[\/ ]/.test(inputValue)) return alert('특수 문자와 공백은 허용되지 않습니다.')
        } else {
            setEtcOpen(false)
        }
        setValue({...value, [name]: inputValue})
    }

    const renderTextField = (id, label, fieldValue) => (
        <TextField
            margin='dense'
            id={id}
            name={id}
            label={label}
            fullWidth
            variant='standard'
            value={fieldValue}
        />
    )

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t('button-attend-approval')}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {leftLeave === '' || leftStatus === '' || value.approver === '' ? (
                        <LoadingSpinner/>
                    ) : (
                        <>
                            {renderTextField('attendance', '남은연차', leftLeave)}
                            {renderTextField('leftstatus', '근태현황', leftStatus)}
                            {renderTextField('approver', '결재자', value.approver)}
                        </>
                    )}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack direction='row' spacing={2}>
                            <DatePicker        
                                label='시작일' 
                                format={'YYYY-MM-DD'}
                                onChange={(newValue) => setValue({...value, start: newValue.format('YYYY-MM-DD')})}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                            <DatePicker 
                                label='종료일' 
                                format={'YYYY-MM-DD'}
                                onChange={(newValue) => setValue({...value, end: newValue.format('YYYY-MM-DD')})}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Stack>
                    </LocalizationProvider>
                    <FormControl fullWidth margin='dense'>
                        <InputLabel>사유</InputLabel>
                        <Select
                            id='reason'
                            name='reason'
                            label='사유'
                            value={value.reason}
                            onChange={handleChange}
                        >
                            {options.map((option) => (
                                <MenuItem value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    { etcOpen && (
                        value.reason === '기타' ? (
                            <TextField 
                                margin='dense'
                                id='etc'
                                name='etc'
                                label='기타'
                                fullWidth
                                variant='outlined'
                                value={value.etc}
                                onChange={handleChange}
                            />
                        ) : value.reason === '반차' ? (
                            <FormControl fullWidth margin='dense'>
                                <InputLabel>반차</InputLabel>
                                <Select
                                    name='etc'
                                    value={value.etc ||'오전반차'}
                                    label='반차'
                                    onChange={handleChange}
                                >
                                    {halfOptions.map((option) => (
                                        <MenuItem value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : null
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>{t('button-cancel')}</Button>
                <Button onClick={handleUpdate} variant='outlined'>{t('button-ok')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Approval