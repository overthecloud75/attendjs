import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import {
    TextField, Button, Stack, Dialog, DialogTitle,
    DialogContent, DialogActions, Box, Typography,
    InputAdornment, Alert
} from '@mui/material'
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Calendar, User, Type } from 'lucide-react'

import { getRoomEvents, postMeetingReservation } from '../../utils/EventUtil'
import MeetingRoomForm from './MeetingRoomForm'
import MeetingTypeForm from './MeetingTypeForm'

const MeetingRoomBooking = ({ setEventsData, open, setOpenReservation }) => {

    const { user } = useAuth()

    const [name, setName] = useState(`${user.name}/${user.department}`)
    const [room, setRoom] = useState('대회의실')
    const [meetingType, setMeetingType] = useState('내부')
    const [title, setTitle] = useState('')
    const [date, setDate] = useState(dayjs())
    const [startTime, setStartTime] = useState(dayjs().startOf('hour').add(1, 'hour'))
    const [endTime, setEndTime] = useState(dayjs().startOf('hour').add(2, 'hour'))

    const handleReserve = async () => {
        if (!room || !name || !title) return alert('모든 필수 정보를 입력해주세요.')

        const start = startTime.format('HH:mm')
        const end = endTime.format('HH:mm')

        if (start >= end) return alert('시작 시간은 종료 시간보다 빨라야 합니다.')

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
            console.error(error)
            alert('회의 예약 중 오류가 발생했습니다. 시간을 다시 확인해주세요.')
        }
    }

    const handleClose = () => { setOpenReservation(false) }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        maxWidth: '500px',
                        width: '100%',
                        bgcolor: 'var(--card-bg)',
                        color: 'var(--text-primary)'
                    }
                }
            }}
        >
            <DialogTitle sx={{
                pb: 1,
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
            }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#eff6ff', // Keep brand color bg for consistency or change if needed, but text inside is blue so light bg is ok? Actually standardizing on blue icon might be better. Let's keep it as is for brand identity or matches other icons.
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6'
                }}>
                    <Calendar size={18} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    회의실 예약
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>

                        {/* 1. 기본 정보 섹션 */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
                                예약 정보
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="예약자 이름"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--text-primary)',
                                            '& fieldset': { borderColor: 'var(--border-color)' },
                                            '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                        }
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <User size={16} style={{ color: 'var(--text-secondary)' }} />
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="회의 주제를 입력하세요"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--text-primary)',
                                            '& fieldset': { borderColor: 'var(--border-color)' },
                                            '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                        }
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Type size={16} style={{ color: 'var(--text-secondary)' }} />
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                />
                            </Stack>
                        </Box>

                        {/* 2. 회의실 및 타입 */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
                                장소 및 유형
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <MeetingRoomForm
                                    room={room}
                                    setRoom={setRoom}
                                />
                                <MeetingTypeForm
                                    meetingType={meetingType}
                                    setMeetingType={setMeetingType}
                                />
                            </Stack>
                        </Box>

                        {/* 3. 일시 선택 */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
                                예약 일시
                            </Typography>
                            <Stack spacing={2}>
                                <DatePicker
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'var(--text-primary)',
                                                    '& fieldset': { borderColor: 'var(--border-color)' },
                                                    '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                                    // '& input::placeholder': { color: 'var(--text-secondary)', opacity: 1 }
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    color: 'var(--text-primary)',
                                                    '&::placeholder': { color: 'var(--text-secondary)', opacity: 1 }
                                                },
                                                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                                '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                                            }
                                        }
                                    }}
                                />
                                <Stack direction='row' spacing={2}>
                                    <TimePicker
                                        label="시작"
                                        value={startTime}
                                        onChange={(newTime) => setStartTime(newTime)}
                                        minutesStep={15}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'var(--text-primary)',
                                                        '& fieldset': { borderColor: 'var(--border-color)' },
                                                        '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                                        // '& input::placeholder': { color: 'var(--text-secondary)', opacity: 1 }
                                                    },
                                                    '& .MuiOutlinedInput-input': {
                                                        color: 'var(--text-primary)',
                                                        '&::placeholder': { color: 'var(--text-secondary)', opacity: 1 }
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                                    '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                                                }
                                            }
                                        }}
                                    />
                                    <Typography sx={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>~</Typography>
                                    <TimePicker
                                        label="종료"
                                        value={endTime}
                                        onChange={(newTime) => setEndTime(newTime)}
                                        minutesStep={15}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'var(--text-primary)',
                                                        '& fieldset': { borderColor: 'var(--border-color)' },
                                                        '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                                        // '& input::placeholder': { color: 'var(--text-secondary)', opacity: 1 }
                                                    },
                                                    '& .MuiOutlinedInput-input': {
                                                        color: 'var(--text-primary)',
                                                        '&::placeholder': { color: 'var(--text-secondary)', opacity: 1 }
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                                    '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                                                }
                                            }
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                        <Alert severity="info" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', '& .MuiAlert-icon': { color: '#0ea5e9' } }}>
                            예약 시 다른 일정과 겹치는지 확인해주세요.
                        </Alert>

                    </Stack>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, borderTop: '1px solid var(--border-color)', gap: 1 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: 'var(--text-secondary)',
                        px: 2,
                        '&:hover': { bgcolor: 'var(--hover-bg)' }
                    }}
                >
                    취소
                </Button>
                <Button
                    onClick={handleReserve}
                    variant="contained"
                    sx={{
                        bgcolor: '#3b82f6',
                        px: 3,
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                        '&:hover': { bgcolor: '#2563eb' }
                    }}
                >
                    예약하기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MeetingRoomBooking