import { useState } from 'react'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'
import { Box, TextField, Button, Typography } from '@mui/material'

const Search = ({
    menu,
    page,
    searchKeyword,
    name,
    setName,
    date,
    setDate,
    clickCount,
    setClickCount,
    setFileName
}) => {
    const [openDate, setOpenDate] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const marginLeftValue = menu ? 1 : 6.5

    const handleSearch = (event) => {
        event.preventDefault()
        setOpenDate(false)
        setClickCount(clickCount + 1)
        setFileName(
            `${page}_${format(date[0].startDate, 'yyyy-MM-dd')}_${format(
                date[0].endDate,
                'yyyy-MM-dd'
            )}_${name}`
        )
    }

    const handleDateClick = (event) => {
        setAnchorEl(event.currentTarget)
        setOpenDate((prev) => !prev)
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                height: 60,
                width: '80%',
                zIndex: 1000,
                ml: marginLeftValue,
            }}
        >
            <Box
                component='form'
                onSubmit={handleSearch}
                sx={{
                    display: 'flex',
                    gap: 1,
                    width: '60%',
                    maxWidth: 900,
                }}
            >
                {/* Name Field */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        flex: 1,
                        minWidth: 100,
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        bgcolor: 'background.paper',
                        border: '1px solid #e1e5e9',
                        borderRadius: 2,
                        '&:focus-within': {
                            borderColor: '#667eea',
                            bgcolor: '#fafbff',
                        },
                    }}
                >
                    <Typography sx={{ color: '#64748b' }}>👤</Typography>
                    <TextField
                        variant='standard'
                        placeholder={`${searchKeyword} 검색...`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                sx: { fontSize: 14, color: '#1e293b', fontWeight: 500 },
                            },
                            inputLabel: {
                                shrink: false,
                            },
                        }}
                    />
                </Box>

                <Box
                    onClick={handleDateClick}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        flex: 1,
                        minWidth: 250,
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        bgcolor: 'background.paper',
                        border: '1px solid #e1e5e9',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            borderColor: '#667eea',
                            bgcolor: '#fafbff',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <Typography sx={{ color: '#64748b' }}>📅</Typography>
                    <Typography
                        sx={{
                            color: '#1e293b',
                            fontSize: 14,
                            fontWeight: 500,
                            flex: 1,
                        }}
                    >
                        {`${format(date[0].startDate, 'yyyy-MM-dd')} ~ ${format(
                            date[0].endDate,
                            'yyyy-MM-dd'
                        )}`}
                    </Typography>

                    {openDate && 
                        <Box
                            sx={{
                                position: 'absolute',
                                zIndex: 9999,
                                top: '100%',
                                marginTop: 1, 
                                backgroundColor: 'white', 
                                borderRadius: 4,
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                border: '1px solid #e1e5e9',
                                overflow: 'hidden',
                            }}
                            onClick={(e) => e.stopPropagation()}
                            >
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDate([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={date}
                                dateDisplayFormat='yyyy-MM-dd'
                            />
                        </Box>
                    } 
                </Box>

                {/* Submit Button */}
                <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    sx={{
                        minWidth: 80,
                        fontSize: 12,
                        px: 2,
                        py: 0,
                        textTransform: 'none',
                    }}
                >
                    🔍 검색
                </Button>
            </Box>
        </Box>
    )
}

export default Search