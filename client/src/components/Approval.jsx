import { useState, useEffect, useRef } from 'react'
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
import { getApprove, postApprove } from '../utils/EventUtil'
import { WORKING } from '../configs/working'

const options = Object.keys(WORKING.outStatus)

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

const Approval = ({open, setOpen}) => {
    const [value, setValue] = useState({
        approver: '', 
        startDate: dayjs(new Date()).format('YYYY-MM-DD'), 
        endDate: dayjs(new Date()).format('YYYY-MM-DD'), 
        reason: '휴가', 
        etc: ''
    })
    const [radioValue, setRadioValue] = useState('휴가')
    const [radioOpen, setRadioOpen] = useState(false)
    const [etcOpen, setEtcOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const result = await getApprove()
            if (!result.err) {setValue({...value, approver: result.resData.name})}
        }
        fetchData()
    // eslint-disable-next-line
    }, [open])

    const handleClose = () => { setOpen(false) }
    const handleRadioClose = () => { 
        setRadioOpen(false)
    }

    const handleUpdate = async () => {
        await postApprove(value)
        setOpen(false)
    }

    const handleChange = (event) => {
        setValue({...value, [event.target.id]: event.target.value})    
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Approval</DialogTitle>
            <DialogContent>
                <TextField 
                    margin='dense'
                    id='approver'
                    label='결재자'
                    fullWidth
                    variant='outlined'
                    value={value.approver?value.approver:''}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label='시작일' 
                        format={'YYYY-MM-DD'}
                        onChange={(newValue) => setValue({...value, startDate: newValue.format('YYYY-MM-DD')})}
                    />
                    <DatePicker 
                        label='종료일' 
                        format={'YYYY-MM-DD'}
                        onChange={(newValue) => setValue({...value, endDate: newValue.format('YYYY-MM-DD')})}
                    />
                </LocalizationProvider>
                <TextField 
                    margin='dense'
                    id='reason'
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
                        label='etc'
                        fullWidth
                        variant='outlined'
                        value={value.etc?value.dates:''}
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