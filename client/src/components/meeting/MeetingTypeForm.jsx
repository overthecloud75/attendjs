import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const MeetingTypeForm = ({meetingType, setMeetingType}) => {
    return (
        <FormControl>
            <InputLabel>회의 구분</InputLabel>
            <Select
                value={meetingType}
                label='회의 구분'
                onChange={(e) => setMeetingType(e.target.value)}
            >
                <MenuItem value='내부'>내부</MenuItem>
                <MenuItem value='외부'>외부</MenuItem>
            </Select>
        </FormControl>
    )
}

export default MeetingTypeForm