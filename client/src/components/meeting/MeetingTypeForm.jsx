import { FormControl, InputLabel, Select, MenuItem, Box, InputAdornment } from '@mui/material'
import { Users2, Building2 } from 'lucide-react'

const MeetingTypeForm = ({ meetingType, setMeetingType }) => {
    return (
        <FormControl fullWidth size="small">
            <InputLabel id="meeting-type-select-label">회의 구분</InputLabel>
            <Select
                labelId="meeting-type-select-label"
                id="meeting-type-select"
                value={meetingType}
                label="회의 구분"
                onChange={(e) => setMeetingType(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        {meetingType === '내부' ? <Users2 size={16} style={{ color: 'var(--text-secondary)' }} /> : <Building2 size={16} style={{ color: 'var(--text-secondary)' }} />}
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
                <MenuItem value='내부'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        내부
                    </Box>
                </MenuItem>
                <MenuItem value='외부'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        외부
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default MeetingTypeForm