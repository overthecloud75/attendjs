import { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import { getPaymentApproval, postPaymentApproval } from '../../utils/EventUtil'
import Editor from './Editor'

const DatePickWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;
`

const FORM_FIELDS = {
    APPROVER: 'approver',
    CONSENTER: 'consenter',
    START: 'start',
    CARD_NO: 'cardNo',
    REASON: 'reason',
    ETC: 'etc',
    CONTENT: 'content'
  }
  
const VALIDATION_MESSAGES = {
    [FORM_FIELDS.START]: '사용일이 작성되지 않습니다.',
    [FORM_FIELDS.CARD_NO]: '카드번호가 작성되지 않았습니다.',
    [FORM_FIELDS.REASON]: '사용내용이 작성되지 않습니다.',
    [FORM_FIELDS.ETC]: '사용금액이 작성되지 않습니다.',
    [FORM_FIELDS.CONTENT]: '이미지가 삽입되지 않았습니다.'
}

const Payment = ({writeMode, open, setOpen}) => {
    const [value, setValue] = useState({
        approver: '', 
        consenter: '',
        start: dayjs(new Date()).format('YYYY-MM-DD'), 
        cardNo: '',
        reason: '', 
        etc: '',
        content: ''
    })
    const {t} = useTranslation()

    useEffect(() => {
        const fetchData = async () => {
            const {data, error} = await getPaymentApproval()
            if (!error) {
                setValue({...value, approver: data.approver.name, consenter: data.consenter.name })
            }
        }
        fetchData()
    // eslint-disable-next-line
    }, [open])

    const validateForm = () => {
        if (value.start > dayjs(new Date()).format('YYYY-MM-DD')) {
            alert('사용일은 당일 이후 날짜는 가능하지 않습니다.')
            return false
        }
        const requiredFields = [FORM_FIELDS.START, FORM_FIELDS.CARD_NO, FORM_FIELDS.REASON, FORM_FIELDS.ETC, FORM_FIELDS.CONTENT]
        for (const field of requiredFields) {
            if (!value[field]) {
                alert(VALIDATION_MESSAGES[field])
                return false
            }
        }
        if (value.start > dayjs(new Date()).format('YYYY-MM-DD')) {
            alert('사용일은 당일 이후 날짜는 가능하지 않습니다.')
            return false
        }
        if (!window.confirm('정말로 상신하시겠습니까?')) return false
        return true
    }

    const handleClose = () => { setOpen(false) }

    const handleUpdate = async () => {
        if (!validateForm()) return 
        await postPaymentApproval(value)
        handleClose()
    }

    const handleChange = (event) => {
        setValue(prev => ({...prev, [event.target.id]: event.target.value})) 
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t('button-payment-approval')}</DialogTitle>
            <DialogContent>
                <TextField 
                    margin='dense'
                    id={FORM_FIELDS.APPROVER}
                    label='결재자'
                    fullWidth
                    variant='standard'
                    value={value.approver}
                />
                <TextField 
                    margin='dense'
                    id={FORM_FIELDS.CONSENTER}
                    label='합의자'
                    fullWidth
                    variant='standard'
                    value={value.consenter}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePickWrapper>
                        <DatePicker 
                            label='사용일' 
                            format={'YYYY-MM-DD'}
                            onChange={(newValue) => setValue(prev => ({
                                ...prev, 
                                start: newValue.format('YYYY-MM-DD')
                            }))}
                            sx={{ width: '100%' }}
                        />
                    </DatePickWrapper>
                </LocalizationProvider>
                <TextField 
                    margin='dense'
                    id={FORM_FIELDS.CARD_NO}
                    label='카드번호'
                    fullWidth
                    variant='outlined'
                    value={value.cardNo}
                    onChange={handleChange}
                />
                <TextField 
                    margin='dense'
                    id={FORM_FIELDS.REASON}
                    label='사용내용'
                    fullWidth
                    variant='outlined'
                    value={value.reason}
                    onChange={handleChange}
                />
                <TextField 
                    margin='dense'
                    id={FORM_FIELDS.ETC}
                    label='사용금액'
                    fullWidth
                    variant='outlined'
                    value={value.etc}
                    onChange={handleChange}
                />
                <Editor
                    writeMode={writeMode}
                    value={value}
                    setValue={setValue}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>{t('button-cancel')}</Button>
                <Button onClick={handleUpdate} variant='outlined'>{t('button-ok')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Payment