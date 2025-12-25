import { FormControl, InputLabel, Select, MenuItem, Box, InputAdornment } from '@mui/material'
import { MapPin } from 'lucide-react'
import { MEETINGROOMS } from '../../configs/meeting'

const MeetingRoomForm = ({ room, setRoom }) => {
    return (
        <FormControl fullWidth size="small">
            <InputLabel id="meeting-room-select-label">회의실</InputLabel>
            <Select
                labelId="meeting-room-select-label"
                id="meeting-room-select"
                value={room}
                label="회의실"
                onChange={(e) => setRoom(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                    </InputAdornment>
                }
                sx={{
                    '& .MuiSelect-select': { pl: 1 },
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text-secondary)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                }}
            >
                {MEETINGROOMS.map((meeting, index) => (
                    <MenuItem key={index} value={meeting}>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                            {meeting}
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default MeetingRoomForm