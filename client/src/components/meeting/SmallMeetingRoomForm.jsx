import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { MEETINGROOMS } from '../../configs/meeting'

const SmallMeetingRoomForm = ({ room, setRoom }) => {
    return (
        <FormControl fullWidth size='small'>
            <InputLabel>회의실</InputLabel>
            <Select
                value={room}
                label='회의실'
                onChange={(e) => setRoom(e.target.value)}
                sx={{
                    bgcolor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text-secondary)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                }}
            >
                {MEETINGROOMS.map((meeting, index) => (
                    <MenuItem key={index} value={meeting}>{meeting}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SmallMeetingRoomForm