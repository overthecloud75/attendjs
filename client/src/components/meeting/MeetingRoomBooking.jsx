import { useState, useMemo } from 'react'
import { TextField, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material'
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { getUser } from '../../storage/userSlice'
import { getRoomEvents, postMeetingReservation } from '../../utils/EventUtil'
import MeetingRoomForm from './MeetingRoomForm'
import MeetingTypeForm from './MeetingTypeForm'

const MeetingRoomBooking = ({setEventsData, open, setOpenReservation}) => {

    const user = useMemo(() => getUser(), [])

    const [name, setName] = useState(`${user.name}/${user.department}`)
    const [room, setRoom] = useState('대회의실')
    const [meetingType, setMeetingType] =  useState('내부')
    const [title, setTitle] = useState('')
    const [date, setDate] = useState(dayjs())
    const [startTime, setStartTime] = useState(dayjs())
    const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'))

    const handleReserve = async () => {
        if (!room || !name || !title) return alert('회의실, 예약자 이름, 회의 제목을 입력해주세요.')
        const start = startTime.format('HH:mm')
        const end = endTime.format('HH:mm')
        if (start >= end) return alert('시작 시간이 종료 시간 보다 큽니다.')
        const newReservation = {
            name,
            room,
            meetingType, 
            title,
            date: date.format('YYYY-MM-DD'),
            start,
            end
        }
        try {
            const event = await postMeetingReservation(newReservation)
            const roomEvent = getRoomEvents(event.data)
            setEventsData(prev => [...prev, roomEvent])
            setOpenReservation(false)
            alert('회의가 성공적으로 예약되었습니다.')
        } catch (error) {
            alert('회의 예약 중 오류가 발생했습니다.')
        }
    }

    const handleClose = () => { setOpenReservation(false) }

    return (
        <Dialog open={open}>
            <DialogTitle>회의실 예약</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        label='예약자 이름'
                        fullWidth
                        value={name}
                        variant='standard'
                        onChange={(e) => setName(e.target.value)}
                    />
                    <MeetingRoomForm
                        room={room}
                        setRoom={setRoom}
                    />
                    <MeetingTypeForm
                        meetingType={meetingType}
                        setMeetingType={setMeetingType}
                    />
                    <TextField
                        label='회의 제목'
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label='예약 일자'
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                        <Stack direction='row' spacing={2}>
                            <TimePicker
                                label='시작 시간'
                                value={startTime}
                                onChange={(newTime) => setStartTime(newTime)}
                                minutesStep={30}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                            <TimePicker
                                label='종료 시간'
                                value={endTime}
                                onChange={(newTime) => setEndTime(newTime)}
                                minutesStep={30}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Stack>
                    </LocalizationProvider>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined'>취소</Button>
                <Button onClick={handleReserve} variant='outlined'>예약</Button>
            </DialogActions>
        </Dialog>
    )
}

export default MeetingRoomBooking