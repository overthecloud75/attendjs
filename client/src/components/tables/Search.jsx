import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'
import { Box, TextField, Button, Typography, Popover, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import CsvDownload from './CsvDownload.jsx'
import { Download } from 'lucide-react'

const Search = ({
    page,
    searchKeyword,
    name,
    setName,
    date,
    setDate,
    clickCount,
    setClickCount,
    setFileName,
    data,
    csvHeaders,
    fileName
}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [portalContainer, setPortalContainer] = useState(null)

    const open = Boolean(anchorEl)

    useEffect(() => {
        setPortalContainer(document.getElementById('navbar-search-portal'))
    }, [])

    const handleSearch = (event) => {
        event.preventDefault()
        setAnchorEl(null)
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
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    if (!portalContainer) return null

    const searchContent = (
        <SearchForm onSubmit={handleSearch}>
            {/* Name Field */}
            <InputContainer>
                <IconWrapper>👤</IconWrapper>
                <TextField
                    variant='standard'
                    placeholder={`${searchKeyword} 검색`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            sx: { fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }
                        }
                    }}
                />
            </InputContainer>

            {/* Date Field */}
            <InputContainer
                as="div"
                onClick={handleDateClick}
                sx={{ flex: 1.5, cursor: 'pointer' }}
                clickable={true}
            >
                <IconWrapper>📅</IconWrapper>
                <Typography
                    sx={{
                        color: 'var(--text-primary)',
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
            </InputContainer>

            {/* Date Picker Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            border: '1px solid var(--border-color)',
                            bgcolor: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            p: 1,
                            marginTop: 1.5,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }
                    }
                }}
            >
                <Box sx={{
                    '& .rdrCalendarWrapper': {
                        color: 'var(--text-primary)',
                        bgcolor: 'transparent'
                    },
                    '& .rdrDateDisplayWrapper': {
                        bgcolor: 'var(--bg-secondary)'
                    },
                    '& .rdrDateDisplayItem': {
                        bgcolor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        '& input': {
                            color: 'var(--text-primary)'
                        }
                    },
                    '& .rdrDateDisplayItemActive': {
                        borderColor: 'var(--text-active)'
                    },
                    '& .rdrMonthAndYearPickers select': {
                        color: 'var(--text-primary)'
                    },
                    '& .rdrMonthName': {
                        color: 'var(--text-primary)'
                    },
                    '& .rdrWeekDay': {
                        color: 'var(--text-secondary)'
                    },
                    '& .rdrDayNumber span': {
                        color: 'var(--text-primary)'
                    },
                    '& .rdrDayPassive .rdrDayNumber span': {
                        color: 'var(--text-secondary)',
                        opacity: 0.5
                    },
                    '& .rdrDayToday .rdrDayNumber span:after': {
                        background: 'var(--text-active)'
                    },
                    '& .rdrInRange ~ .rdrDayNumber span, & .rdrStartEdge ~ .rdrDayNumber span, & .rdrEndEdge ~ .rdrDayNumber span': {
                        color: '#fff'
                    },
                    '& .rdrNextPrevButton': {
                        bgcolor: 'var(--bg-secondary)',
                        '&:hover': {
                            bgcolor: 'var(--hover-bg)'
                        }
                    },
                    '& .rdrPprevButton i, & .rdrNextButton i': {
                        borderColor: 'var(--text-primary)'
                    }
                }}>
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        dateDisplayFormat='yyyy-MM-dd'
                        rangeColors={['#4f46e5', '#3ecf8e', '#fed14c']}
                    />
                </Box>
            </Popover>

            {/* Submit Button */}
            <SearchButton type='submit' variant='contained'>
                검색
            </SearchButton>

            {/* Export Divider & Button */}
            {data && data.length > 0 && (
                <>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'var(--border-color)', height: 20, alignSelf: 'center' }} />
                    <CsvDownload 
                        data={data} 
                        csvHeaders={csvHeaders} 
                        fileName={fileName} 
                        customButton={
                            <IconButtonStyled>
                                <Download size={18} />
                                <Typography sx={{ fontSize: 13, fontWeight: 600, ml: 1, display: { xs: 'none', lg: 'block' } }}>
                                    Export
                                </Typography>
                            </IconButtonStyled>
                        }
                    />
                </>
            )}
        </SearchForm>
    )

    return createPortal(searchContent, portalContainer)
}

export default Search

// --- Styled Components ---

const SearchForm = styled('form')(({ theme }) => ({
    display: 'none',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 700,
    position: 'relative',
    [theme.breakpoints.up('lg')]: {
        display: 'flex',
    },
}))

const InputContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'clickable'
})(({ theme, clickable }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    padding: '4px 12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    transition: 'all 0.2s ease',
    ...(clickable
        ? {
            cursor: 'pointer',
            '&:hover': {
                borderColor: 'var(--text-secondary)',
                backgroundColor: 'var(--hover-bg)',
            },
            '&:active': {
                transform: 'translateY(1px)',
            },
        }
        : {
            '&:focus-within': {
                borderColor: 'var(--text-active)',
                backgroundColor: 'var(--bg-primary)',
                boxShadow: '0 0 0 2px var(--bg-active)',
            },
        }),
}))

const IconWrapper = styled(Typography)({
    color: 'var(--text-secondary)',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
})

const SearchButton = styled(Button)({
    minWidth: 70,
    height: 36,
    fontSize: 13,
    boxShadow: 'none',
    borderRadius: 8,
    textTransform: 'none',
    backgroundColor: 'var(--text-active)',
    color: '#ffffff',
    '&:hover': {
        backgroundColor: 'var(--text-active)',
        opacity: 0.9,
        boxShadow: 'none',
    },
})

const IconButtonStyled = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'var(--hover-bg)',
        color: 'var(--text-active)',
    },
}))