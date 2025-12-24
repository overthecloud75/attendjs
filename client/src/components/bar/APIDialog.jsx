import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Tooltip,
    InputAdornment,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material'
import { Eye, EyeOff, Copy, Check, RefreshCw } from 'lucide-react'
import { getApiKey, updateApiKey } from '../../utils/EventUtil'

const APIDialog = ({ open, apiKey: initialApiKey, handleClose }) => {

    const [apiKey, setApiKey] = useState(initialApiKey || '')
    const [showKey, setShowKey] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (open) {
            fetchApiKey()
        } else {
            // Reset state on close
            setShowKey(false)
            setCopySuccess(false)
            setError(null)
        }
    }, [open])

    const fetchApiKey = async () => {
        setLoading(true)
        try {
            const { data, error } = await getApiKey()
            if (!error && data) {
                setApiKey(data.apiKey)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await updateApiKey()
            if (!error && data) {
                setApiKey(data.apiKey)
                setCopySuccess(false)
            } else {
                throw new Error('Update failed')
            }
        } catch (err) {
            setError('API Key를 생성하거나 업데이트하는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        if (!apiKey) return
        try {
            await navigator.clipboard.writeText(apiKey)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: { borderRadius: 3, padding: 1 }
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.25rem' }}>
                API Key 관리
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        이 API Key는 외부 애플리케이션 연동에 사용되는 보안 자격 증명입니다.<br />
                        타인에게 노출되지 않도록 주의해 주세요.
                    </Typography>

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        margin="dense"
                        id="apiKey"
                        label="Your API Key"
                        type={showKey ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        value={apiKey || ''}
                        placeholder={loading ? "Loading..." : "API Key가 없습니다."}
                        slotProps={{
                            input: {
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title={showKey ? '숨기기' : '보기'}>
                                            <IconButton onClick={() => setShowKey(!showKey)} edge="end" size="small">
                                                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={copySuccess ? '복사됨!' : '복사'}>
                                            <IconButton
                                                onClick={handleCopy}
                                                edge="end"
                                                size="small"
                                                disabled={!apiKey}
                                                sx={{ ml: 1, color: copySuccess ? 'success.main' : 'inherit' }}
                                            >
                                                {copySuccess ? <Check size={20} /> : <Copy size={20} />}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: 'monospace',
                                fontWeight: 500,
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshCw size={16} />}
                    disableElevation
                >
                    {apiKey ? '재발급 (Regenerate)' : '새로 발급 (Generate)'}
                </Button>
                <Button onClick={handleClose} variant="outlined" color="inherit">
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default APIDialog