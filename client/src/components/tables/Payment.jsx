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
    position: relative;
`

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
            const result = await getPaymentApproval()
            if (!result.err) {
                setValue({...value, approver: result.resData.approver.name, consenter: result.resData.consenter.name })
            }
        }
        fetchData()
    // eslint-disable-next-line
    }, [open])

    const checkValue = () => {
        if (!value.start) {
            alert('사용일이 작성되지 않습니다.')
            return false
        }
        if (value.start > dayjs(new Date()).format('YYYY-MM-DD')) {
            alert('사용일은 당일 이후 날짜는 가능하지 않습니다.')
            return false
        }
        if (!value.cardNo) {
            alert('카드번호가 작성되지 않았습니다.')
            return false
        }
        if (!value.reason) {
            alert('사용내용이 작성되지 않습니다.')
            return false
        }
        if (!value.etc) {
            alert('사용금액이 작성되지 않습니다.')
            return false
        }
        if (!value.content) {
            alert('이미지가 삽입되지 않았습니다.')
            return false
        }
        if (!window.confirm('정말로 상신하시겠습니까?')) return false
        return true
    }

    const handleClose = () => { setOpen(false) }

    const handleUpdate = async () => {
        const valueStatus = checkValue()
        if (!valueStatus) return 
        await postPaymentApproval(value)
        setOpen(false)
    }

    const handleChange = (event) => {
        setValue({...value, [event.target.id]: event.target.value}) 
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t('button-payment-approval')}</DialogTitle>
            <DialogContent>
                <TextField 
                    margin='dense'
                    id='approver'
                    name='결재자'
                    label='결재자'
                    fullWidth
                    variant='standard'
                    value={value.approver}
                />
                <TextField 
                    margin='dense'
                    id='consenter'
                    name='합의자'
                    label='합의자'
                    fullWidth
                    variant='standard'
                    value={value.consenter}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePickWrapper style={{ width: '100%' }}>
                        <DatePicker 
                            label='사용일' 
                            format={'YYYY-MM-DD'}
                            onChange={(newValue) => setValue({...value, start: newValue.format('YYYY-MM-DD')})}
                        />
                    </DatePickWrapper>
                </LocalizationProvider>
                <TextField 
                    margin='dense'
                    id='cardNo'
                    name='카드번호'
                    label='카드번호'
                    fullWidth
                    variant='outlined'
                    value={value.cardNo}
                    onChange={handleChange}
                />
                <TextField 
                    margin='dense'
                    id='reason'
                    name='사용내용'
                    label='사용내용'
                    fullWidth
                    variant='outlined'
                    value={value.reason}
                    onChange={handleChange}
                />
                <TextField 
                    margin='dense'
                    id='etc'
                    name='사용금액'
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