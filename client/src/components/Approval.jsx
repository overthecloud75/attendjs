import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { getApproval, postApproval } from '../utils/EventUtil'
import { WORKING } from '../configs/working'

const options = Object.keys(WORKING.outStatus)

const DatePickWrapper = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
`

const RadioForm = ({open, onClose, value, setValue, radioValue, setRadioValue, setEtcOpen, ...other}) => {
    
    const radioGroupRef = useRef(null)
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
            <DialogTitle>사유</DialogTitle>
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
                <Button autoFocus onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}

const Approval = ({navigate, open, setOpen}) => {
    const [value, setValue] = useState({
        approver: '', 
        start: dayjs(new Date()).format('YYYY-MM-DD'), 
        end: dayjs(new Date()).format('YYYY-MM-DD'), 
        reason: '휴가', 
        etc: ''
    })
    const [leftLeave, setLeftLeave] = useState('')
    const [radioValue, setRadioValue] = useState('휴가')
    const [radioOpen, setRadioOpen] = useState(false)
    const [etcOpen, setEtcOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const result = await getApproval()
            if (!result.err) {
                const summary = result.resData.summary 
                setValue({...value, approver: result.resData.approver.name})
                setLeftLeave(`남은연차 ${summary.leftAnnualLeave}, 미출근 ${summary['미출근']}, 지각 ${summary['지각']}, 휴가 ${summary['휴가'] + summary['반차']}`)
            }
        }
        fetchData()
    // eslint-disable-next-line
    }, [open])

    const handleClose = () => { setOpen(false) }
    const handleRadioClose = () => { 
        setRadioOpen(false)
    }

    const handleUpdate = async () => {
        if (value.reason==='출근' && value.end >= dayjs(new Date()).format('YYYY-MM-DD')) {
            return alert('출근 신청은 당일 이전 날짜에서만 가능합니다.')
        }
        if (!window.confirm('정말로 상신하시겠습니까?')) return
        await postApproval(value)
        setOpen(false)
        navigate('/approvalhistory')
    }

    const handleChange = (event) => {
        if (event.target.id ==='etc' && event.target.value.length > 5){ 
            window.alert('5글자 이하로 적어주세요.')
        } else {
            setValue({...value, [event.target.id]: event.target.value}) 
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>근태 결재</DialogTitle>
            <DialogContent>
                {leftLeave===''? 
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress/>
                    </Box>:
                    <TextField 
                        margin='dense'
                        id='attendance'
                        name='근태현황'
                        label='근태현황'
                        fullWidth
                        variant='standard'
                        value={leftLeave}
                    />
                }
                <TextField 
                    margin='dense'
                    id='approver'
                    name='결재자'
                    label='결재자'
                    fullWidth
                    variant='standard'
                    value={value.approver}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePickWrapper>
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
                <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                <Button onClick={handleUpdate} variant='outlined'>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Approval