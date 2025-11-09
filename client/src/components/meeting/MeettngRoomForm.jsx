import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const MeetingRoomForm = ({room, setRoom}) => {
    return (
        <FormControl>
            <InputLabel>회의실</InputLabel>
            <Select
                value={room}
                label='회의실'
                onChange={(e) => setRoom(e.target.value)}
            >
                <MenuItem value='대회의실'>대회의실</MenuItem>
                <MenuItem value='B 회의실'>B 회의실</MenuItem>
                <MenuItem value='C 회의실'>C 회의실</MenuItem>
            </Select>
        </FormControl>
    )
}

export default MeetingRoomForm