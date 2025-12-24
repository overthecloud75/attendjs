import { useState, useEffect, useRef, useMemo } from 'react'
import dayjs from 'dayjs'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Box, Typography, Divider, Fade, Grid } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import axios from 'axios'
import { CreditCard, Calendar, User, FileText, Receipt, DollarSign, CheckCircle2 } from 'lucide-react'

import { getPaymentApproval, postPaymentApproval } from '../../utils/EventUtil'

const FORM_FIELDS = {
    APPROVER: 'approver',
    CONSENTER: 'consenter',
    START: 'start',
    CARD_NO: 'cardNo',
    REASON: 'reason',
    ETC: 'etc',
    CONTENT: 'content'
}

const VALIDATION_MESSAGES = {
    [FORM_FIELDS.START]: '사용일이 작성되지 않습니다.',
    [FORM_FIELDS.CARD_NO]: '카드번호가 작성되지 않았습니다.',
    [FORM_FIELDS.REASON]: '사용내용이 작성되지 않습니다.',
    [FORM_FIELDS.ETC]: '사용금액이 작성되지 않습니다.',
    [FORM_FIELDS.CONTENT]: '이미지가 삽입되지 않았습니다.'
}

const Payment = ({ writeMode, open, setOpen }) => {
    const [value, setValue] = useState({
        approver: '',
        consenter: '',
        start: dayjs(new Date()).format('YYYY-MM-DD'),
        cardNo: '',
        reason: '',
        etc: '',
        content: ''
    })
    const { t } = useTranslation()

    const quillRef = useRef(null)

    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/png, image/jpeg, image/webp')
        input.click()

        input.onchange = async () => {
            const file = input.files[0]
            if (!file) return

            // MIME check
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
                alert('지원되지 않는 이미지 형식입니다. (png, jpeg, webp만 가능)')
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('이미지 크기는 5MB 이하여야 합니다.')
                return
            }

            const formData = new FormData()
            formData.append('file', file)

            try {
                const res = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                const range = quillRef.current.getEditor().getSelection()
                const url = res.data.url
                quillRef.current.getEditor().insertEmbed(range.index, 'image', url)
            } catch (err) {
                console.error(err)
                alert('이미지 업로드에 실패했습니다.')
            }
        }
    }

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['image']
                ],
                handlers: {
                    image: imageHandler
                }
            }
        }
    }, [])

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                const { data, error } = await getPaymentApproval()
                if (!error) {
                    setValue(prev => ({
                        ...prev,
                        approver: `${data.approver.name}/${data.approver.position}/${data.approver.department}`,
                        consenter: data.consenter ? `${data.consenter.name}/${data.consenter.position}/${data.consenter.department}` : ''
                    }))
                }
            }
            fetchData()
        }
    }, [open])

    const validateForm = () => {
        if (value.start > dayjs(new Date()).format('YYYY-MM-DD')) {
            alert('사용일은 당일 이후 날짜는 가능하지 않습니다.')
            return false
        }
        const requiredFields = [FORM_FIELDS.START, FORM_FIELDS.CARD_NO, FORM_FIELDS.REASON, FORM_FIELDS.ETC, FORM_FIELDS.CONTENT]
        for (const field of requiredFields) {
            if (!value[field]) {
                alert(VALIDATION_MESSAGES[field])
                return false
            }
        }
        if (!window.confirm('정말로 상신하시겠습니까?')) return false
        return true
    }

    const handleClose = () => { setOpen(false) }

    const handleUpdate = async () => {
        if (!validateForm()) return
        await postPaymentApproval(value)
        handleClose()
    }

    const handleChange = (event) => {
        setValue(prev => ({ ...prev, [event.target.id]: event.target.value }))
    }

    const renderInfoRow = (icon, label, fieldValue) => (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, height: '100%' }}>
            <Box sx={{ color: '#64748b', display: 'flex' }}>{icon}</Box>
            <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#64748b" display="block">{label}</Typography>
                <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ wordBreak: 'break-all' }}>
                    {fieldValue || '-'}
                </Typography>
            </Box>
        </Stack>
    )

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}>
                        <Receipt size={24} />
                    </Box>
                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                        비용 결재
                        <Typography component="span" variant="body2" color="#64748b" display="block" fontWeight="400" sx={{ mt: 0.5 }}>
                            법인카드 사용 내역 및 영수증을 제출합니다.
                        </Typography>
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 2 }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* 결재 라인 정보 (Read Only style but data persists) */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {renderInfoRow(<User size={18} />, '결재자', value.approver)}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {renderInfoRow(<CheckCircle2 size={18} />, '합의자', value.consenter)}
                        </Grid>
                    </Grid>

                    <Divider />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label='사용일'
                                    format={'YYYY-MM-DD'}
                                    onChange={(newValue) => setValue(prev => ({
                                        ...prev,
                                        start: newValue ? newValue.format('YYYY-MM-DD') : ''
                                    }))}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            InputProps: { startAdornment: <Calendar size={16} style={{ marginRight: 8, color: '#94a3b8' }} /> }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id={FORM_FIELDS.CARD_NO}
                                label='카드번호'
                                fullWidth
                                variant='outlined'
                                value={value.cardNo}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: <CreditCard size={16} style={{ marginRight: 8, color: '#94a3b8' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id={FORM_FIELDS.ETC}
                                label='사용금액'
                                fullWidth
                                type="number"
                                variant='outlined'
                                value={value.etc}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: <DollarSign size={16} style={{ marginRight: 8, color: '#94a3b8' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id={FORM_FIELDS.REASON}
                                label='사용내용'
                                placeholder='예: 팀 회식, 비품 구매'
                                fullWidth
                                variant='outlined'
                                value={value.reason}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                    startAdornment: <FileText size={16} style={{ marginRight: 8, color: '#94a3b8' }} />
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="600" color="#475569" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            영수증 이미지 첨부
                        </Typography>
                        <Box sx={{
                            '& .quill': { bgcolor: 'white' },
                            '& .ql-toolbar': { borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderColor: '#e2e8f0', bgcolor: '#f8fafc' },
                            '& .ql-container': { borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', borderColor: '#e2e8f0', minHeight: '300px' },
                            '& .ql-editor': { fontSize: '1rem', minHeight: '300px' }
                        }}>
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={value.content || ''}
                                onChange={(content) => setValue(prev => ({ ...prev, content }))}
                                readOnly={!writeMode}
                                modules={writeMode ? modules : { toolbar: false }}
                                placeholder='여기에 영수증 사진을 업로드해주세요.'
                            />
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button
                    onClick={handleClose}
                    variant='outlined'
                    sx={{
                        borderRadius: 2,
                        color: '#64748b',
                        borderColor: '#e2e8f0',
                        fontSize: '0.9rem',
                        px: 3,
                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
                    }}
                >
                    {t('button-cancel')}
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
                    {t('button-ok')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Payment