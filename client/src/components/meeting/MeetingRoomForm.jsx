import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { MEETINGROOMS } from '../../configs/meeting'

const MeetingRoomForm = ({room, setRoom}) => {
    return (
        <FormControl>
            <InputLabel>회의실</InputLabel>
            <Select
                value={room}
                label='회의실'
                onChange={(e) => setRoom(e.target.value)}
            >
                {MEETINGROOMS.map((meeting) => (
                    <MenuItem value={meeting}>{meeting}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default MeetingRoomForm