import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'

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
    const [portalContainer, setPortalContainer] = useState(null)

    useEffect(() => {
        setPortalContainer(document.getElementById('navbar-search-portal'))
    }, [])

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
        setOpenDate((prev) => !prev)
    }

    const searchContent = (
        <Box
            component='form'
            onSubmit={handleSearch}
            sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 1.5,
                width: '100%',
                maxWidth: 700,
                position: 'relative' // For date picker positioning
            }}
        >
            {/* Name Field */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1,
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:focus-within': {
                        borderColor: '#6366f1',
                        bgcolor: '#fff',
                        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
                    },
                }}
            >
                <Typography sx={{ color: '#64748b' }}>👤</Typography>
                <TextField
                    variant='standard'
                    placeholder={`${searchKeyword} 검색`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: 13, color: '#1e293b', fontWeight: 500 }
                    }}
                />
            </Box>

            {/* Date Field */}
            <Box
                onClick={handleDateClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1.5,
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: '#94a3b8',
                        bgcolor: '#f1f5f9',
                    },
                    '&:active': {
                        transform: 'translateY(1px)'
                    }
                }}
            >
                <Typography sx={{ color: '#64748b' }}>📅</Typography>
                <Typography
                    sx={{
                        color: '#1e293b',
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {`${format(date[0].startDate, 'yyyy-MM-dd')} ~ ${format(
                        date[0].endDate,
                        'yyyy-MM-dd'
                    )}`}
                </Typography>
            </Box>

            {/* Date Picker Dropdown */}
            {openDate && (
                <Paper
                    elevation={5}
                    sx={{
                        position: 'absolute',
                        top: '120%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1300,
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        p: 1
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        dateDisplayFormat='yyyy-MM-dd'
                        rangeColors={['#4f46e5', '#3ecf8e', '#fed14c']}
                    />
                </Paper>
            )}

            {/* Submit Button */}
            <Button
                type='submit'
                variant='contained'
                color='primary'
                sx={{
                    minWidth: 70,
                    height: 36,
                    fontSize: 13,
                    boxShadow: 'none',
                    borderRadius: 2,
                    textTransform: 'none',
                    bgcolor: '#4f46e5',
                    '&:hover': {
                        bgcolor: '#4338ca',
                        boxShadow: 'none'
                    }
                }}
            >
                검색
            </Button>
        </Box>
    )

    if (!portalContainer) return null

    return createPortal(searchContent, portalContainer)
}

export default Search