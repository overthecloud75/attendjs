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
                        <MapPin size={16} color="#94a3b8" />
                    </InputAdornment>
                }
                sx={{
                    '& .MuiSelect-select': { pl: 1 }
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