import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, RadioGroup, Radio, FormControlLabel} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import { postApproval } from '../utils/EventUtil'
import { WORKING } from '../configs/working'
import { LoadingSpinner } from '../utils/GeneralUtil'
import { useApproval } from '../hooks/useApproval'

const options = Object.keys(WORKING.outStatus)

const DatePickWrapper = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
`

const RadioForm = ({open, onClose, value, setValue, radioValue, setRadioValue, setEtcOpen, ...other}) => {
    
    const radioGroupRef = useRef(null)
    const {t} = useTranslation()

    useEffect(() => {
        if (!open) {
          setRadioValue(radioValue)
        }
    // eslint-disable-next-line
    }, [radioValue, open])

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
          radioGroupRef.current.focus()
        }
    }

    const handleCancel = () => {
        setRadioValue('휴가')
        onClose()
    }

    const handleOk = () => {
        setValue({...value, reason: radioValue})
        onClose()
    }

    const handleChange = (event) => {
        setRadioValue(event.target.value)
        if (event.target.value === '기타') {setEtcOpen(true)}
        else {setEtcOpen(false)}
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth='xs'
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
            >
            <DialogTitle>{t('reason')}</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    ref={radioGroupRef}
                    name='radio_menu'
                    value={radioValue}
                    onChange={handleChange}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            value={option}
                            key={option}
                            control={<Radio />}
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>{t('button-cancel')}</Button>
                <Button onClick={handleOk}>{t('button-ok')}</Button>
            </DialogActions>
        </Dialog>
    )
}

const validateApproval = (value) => {
    if (value.reason === '출근' && value.end >= dayjs(new Date()).format('YYYY-MM-DD')) {
        alert('출근 신청은 당일 이전 날짜에서만 가능합니다.')
        return false
    }
    return window.confirm('정말로 상신하시겠습니다.?')
}

const Approval = ({navigate, open, setOpen}) => {
    const {t} = useTranslation()
    const [radioValue, setRadioValue] = useState('휴가')
    const [radioOpen, setRadioOpen] = useState(false)
    const [etcOpen, setEtcOpen] = useState(false)

    const { value, setValue, leftLeave, leftStatus } = useApproval() 

    const handleClose = () => { setOpen(false) }
    const handleRadioClose = () => { setRadioOpen(false)}

    const handleUpdate = async () => {
        if (!validateApproval(value)) return 
        await postApproval(value)
        setOpen(false)
        navigate('/approvalhistory')
    }

    const handleChange = (event) => {
        const { id, value: inputValue } = event.target
        if (id === 'etc') {
            if (inputValue.length > 5) {
                alert('5글자 이하로 적어주세요.')
                return
            }
            if (inputValue.length === 0) {
                alert('사유를 적어 주세요.')
                return
            }
        }  
        setValue({...value, [id]: inputValue})
    }

    const renderTextField = (id, label, value) => (
        <TextField
            margin='dense'
            id={id}
            name={label}
            label={label}
            fullWidth
            variant='standard'
            value={value}
        />
    )

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t('button-attend-approval')}</DialogTitle>
            <DialogContent>
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
                    <DatePickWrapper style={{ width: '100%', justifyContent: 'space-between'}}>
                        <DatePicker        
                            label='시작일' 
                            format={'YYYY-MM-DD'}
                            onChange={(newValue) => setValue({...value, start: newValue.format('YYYY-MM-DD')})}
                        />
                        <DatePicker 
                            label='종료일' 
                            format={'YYYY-MM-DD'}
                            onChange={(newValue) => setValue({...value, end: newValue.format('YYYY-MM-DD')})}
                        />
                    </DatePickWrapper>
                </LocalizationProvider>
                <TextField 
                    margin='dense'
                    id='reason'
                    name='사유'
                    label='사유'
                    fullWidth
                    variant='outlined'
                    value={radioValue}
                    onClick={() => setRadioOpen(true)}
                />
                <RadioForm
                    id='radio_menu'
                    keepMounted
                    open={radioOpen}
                    onClose={handleRadioClose}
                    setValue={setValue}
                    value={value}
                    radioValue={radioValue}
                    setRadioValue={setRadioValue}
                    setEtcOpen={setEtcOpen}
                />
                {!radioOpen&&etcOpen&&
                    <TextField 
                        margin='dense'
                        id='etc'
                        name='etc'
                        label='etc'
                        fullWidth
                        variant='outlined'
                        value={value.etc}
                        onChange={handleChange}
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>{t('button-cancel')}</Button>
                <Button onClick={handleUpdate} variant='outlined'>{t('button-ok')}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Approval