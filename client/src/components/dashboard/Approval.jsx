import dayjs from 'dayjs'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Stack, Box, Typography, Divider, Fade, Chip } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import { Calendar, User, FileText, CheckCircle2, Clock, CalendarDays } from 'lucide-react'

import { postApproval } from '../../utils/EventUtil'
import { WORKING } from '../../configs/working'
import { LoadingSpinner } from '../../utils/GeneralUtil'
import { useApproval } from '../../hooks/useApproval'

const REASON_OPTIONS = Object.keys(WORKING.outStatus)

/**
 * UI Configuration for extra fields based on the selected reason.
 * This removes hardcoded logic from the component rendering.
 */
const EXTRA_FIELD_CONFIG = {
    '기타': {
        type: 'text',
        label: '기타 사유 (10자 이내)',
        placeholder: '사유를 입력하세요',
    },
    '반차': {
        type: 'select',
        label: '반차 구분',
        options: WORKING.outStatus['반차'],
        defaultValue: '오전반차'
    }
}

const Approval = ({ navigate, open, setOpen }) => {
    const { t } = useTranslation()
    const { value, setValue, leftLeave, leftStatus } = useApproval()

    // Derived state for 'extra field' configuration
    const fieldConfig = EXTRA_FIELD_CONFIG[value.reason]
    const hasExtraField = !!fieldConfig

    const handleClose = () => setOpen(false)

    const validateApproval = (formValue) => {
        if (formValue.reason === '출근' && formValue.end >= dayjs().format('YYYY-MM-DD')) {
            alert('출근 신청은 당일 이전 날짜에서만 가능합니다.')
            return false
        }
        if (formValue.reason === '기타' && (!formValue.etc || formValue.etc.trim().length === 0)) {
            alert('사유를 적어 주세요.')
            return false
        }
        return window.confirm('정말로 상신하시겠습니다?')
    }

    const handleUpdate = async () => {
        if (!validateApproval(value)) return
        await postApproval(value)
        handleClose()
        navigate('/approvalhistory')
    }

    const handleChange = (event) => {
        const { name, value: inputValue } = event.target

        if (name === 'etc') {
            if (inputValue.length > 10) return alert('10글자 이하로 적어주세요.')
            if (/[\/ ]/.test(inputValue)) return alert('특수 문자와 공백은 허용되지 않습니다.')
            if (['휴가', '반차', '병가', '연차'].some(word => inputValue.includes(word))) {
                return alert('휴가, 반차, 병가, 연차는 신청 사유에서 직접 선택해 주세요.')
            }
        }

        setValue(prev => ({ ...prev, [name]: inputValue }))
    }

    const handleDateChange = (name, newValue) => {
        setValue(prev => ({ ...prev, [name]: newValue ? newValue.format('YYYY-MM-DD') : '' }))
    }

    const renderInfoRow = (icon, label, fieldValue, color = 'var(--text-primary)') => (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5, bgcolor: 'var(--bg-secondary)', borderRadius: 2 }}>
            <Box sx={{ color: 'var(--text-secondary)', display: 'flex' }}>{icon}</Box>
            <Box>
                <Typography variant="caption" color="#64748b" display="block">{label}</Typography>
                <Typography variant="body2" fontWeight="600" color={color}>
                    {fieldValue || '-'}
                </Typography>
            </Box>
        </Stack>
    )

    const renderExtraField = () => {
        if (!fieldConfig) return null

        return (
            <Fade in={hasExtraField}>
                <Box>
                    {fieldConfig.type === 'text' ? (
                        <TextField
                            name='etc'
                            label={fieldConfig.label}
                            fullWidth
                            variant='outlined'
                            value={value.etc || ''}
                            onChange={handleChange}
                            size="small"
                            placeholder={fieldConfig.placeholder}
                            sx={{
                                bgcolor: 'var(--card-bg)',
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--text-primary)',
                                    '& fieldset': { borderColor: 'var(--border-color)' },
                                    '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
                            }}
                        />
                    ) : (
                        <FormControl fullWidth size="small">
                            <InputLabel id="extra-field-label">{fieldConfig.label}</InputLabel>
                            <Select
                                labelId="extra-field-label"
                                name='etc'
                                value={value.etc || fieldConfig.defaultValue}
                                label={fieldConfig.label}
                                onChange={handleChange}
                                sx={{
                                    bgcolor: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text-secondary)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                                    '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                                }}
                            >
                                {fieldConfig.options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </Fade>
        )
    }

    const isLoading = leftLeave === '' || leftStatus === '' || value.approver === ''

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { borderRadius: 3, maxWidth: 450, width: '100%', bgcolor: 'var(--card-bg)', color: 'var(--text-primary)' }
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box sx={{ p: 1, bgcolor: 'var(--bg-active)', borderRadius: '50%', color: 'var(--text-active)' }}>
                        <FileText size={24} />
                    </Box>
                    <Typography component="div" variant="h6" fontWeight="700" color="var(--text-primary)">
                        결재 신청
                        <Typography component="span" variant="body2" color="var(--text-secondary)" display="block" fontWeight="400" sx={{ mt: 0.5 }}>
                            휴가 및 근태 관련 결재를 신청합니다.
                        </Typography>
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 2 }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {isLoading ? (
                        <Box py={4} display="flex" justifyContent="center">
                            <LoadingSpinner />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                            {renderInfoRow(<Clock size={16} />, '남은 연차', leftLeave, '#3b82f6')}
                            {renderInfoRow(<CheckCircle2 size={16} />, '근태 상태', leftStatus, leftStatus === '정상' ? '#166534' : '#d97706')}
                            <Box sx={{ gridColumn: '1 / -1' }}>
                                {renderInfoRow(<User size={16} />, '결재 승인자', value.approver)}
                            </Box>
                        </Box>
                    )}

                    <Divider flexItem>
                        <Chip label="신청 상세" size="small" sx={{ color: 'var(--text-secondary)', bgcolor: 'var(--bg-secondary)' }} />
                    </Divider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack direction='row' spacing={2}>
                            <DatePicker
                                label='시작일'
                                format='YYYY-MM-DD'
                                onChange={(val) => handleDateChange('start', val)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        slotProps: {
                                            input: {
                                                startAdornment: <Calendar size={16} style={{ marginRight: 8, color: 'var(--text-secondary)' }} />
                                            }
                                        },
                                        sx: {
                                            '& .MuiOutlinedInput-root': {
                                                color: 'var(--text-primary)',
                                                '& fieldset': { borderColor: 'var(--border-color)' },
                                                '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                color: 'var(--text-primary)',
                                            },
                                            '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                                            '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                                        }
                                    }
                                }}
                            />
                            <DatePicker
                                label='종료일'
                                format='YYYY-MM-DD'
                                onChange={(val) => handleDateChange('end', val)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        slotProps: {
                                            input: {
                                                startAdornment: <Calendar size={16} style={{ marginRight: 8, color: 'var(--text-secondary)' }} />
                                            }
                                        },
                                        sx: {
                                            '& .MuiOutlinedInput-root': {
                                                color: 'var(--text-primary)',
                                                '& fieldset': { borderColor: 'var(--border-color)' },
                                                '&:hover fieldset': { borderColor: 'var(--text-secondary)' },
                                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                color: 'var(--text-primary)',
                                            },
                                            '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                                            '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                                        }
                                    }
                                }}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'var(--text-secondary)', '&.Mui-focused': { color: '#3b82f6' } }}>신청 사유</InputLabel>
                        <Select
                            name='reason'
                            label='신청 사유'
                            value={value.reason || ''}
                            onChange={handleChange}
                            startAdornment={<CalendarDays size={16} style={{ marginLeft: 8, marginRight: 8, color: 'var(--text-secondary)' }} />}
                            sx={{
                                color: 'var(--text-primary)',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text-secondary)' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                                '& .MuiSvgIcon-root': { color: 'var(--text-secondary)' }
                            }}
                        >
                            {REASON_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {hasExtraField && renderExtraField()}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button
                    onClick={handleClose}
                    variant='outlined'
                    sx={{
                        borderRadius: 2,
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border-color)',
                        fontSize: '0.9rem',
                        px: 3,
                        '&:hover': { bgcolor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }
                    }}
                >
                    취소
                </Button>
                <Button
                    onClick={handleUpdate}
                    variant='contained'
                    sx={{
                        borderRadius: 2,
                        bgcolor: '#3b82f6',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        px: 3,
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                        '&:hover': { bgcolor: '#2563eb' }
                    }}
                >
                    신청하기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Approval