import { useState, useRef } from 'react';
import { 
    Box, Button, Typography, Paper, Stack, CircularProgress, 
    Divider, Chip, IconButton, Fade, Alert, AlertTitle
} from '@mui/material';
import { 
    Camera, Upload, X, ScanSearch, CheckCircle, 
    AlertTriangle, CreditCard, Calendar, Store, DollarSign,
    Save, Send
} from 'lucide-react';
import { TextField } from '@mui/material';
import axios from 'axios';

/**
 * Smart Receipt Scanner Component
 * Handles image upload and AI-driven OCR analysis.
 */
const ReceiptScanner = ({ onComplete }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);
    const [uploadId, setUploadId] = useState(null);
    const [error, setError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // Form fields for submission
    const [reason, setReason] = useState('식대');
    const [cardNo, setCardNo] = useState('');
    const [etc, setEtc] = useState('');
    
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setUploadId(null);
            setError(null);
            setSaveSuccess(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setUploadId(null);
        setError(null);
        setSaveSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleScan = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const response = await axios.post('/api/expense/scan', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setResult(response.data.analysis);
                setUploadId(response.data.uploadId);
                
                // Pre-fill form from AI results
                if (response.data.analysis.extractedData) {
                    const { merchant, amount } = response.data.analysis.extractedData;
                    setEtc(amount ? amount.toString() : '');
                }
                
                if (onComplete) onComplete(response.data.analysis);
            } else {
                throw new Error('Analysis failed');
            }
        } catch (err) {
            console.error('Scan Error:', err);
            setError(err.response?.data?.message || '영수증 분석 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result || !uploadId) return;
        
        setSaving(true);
        setError(null);
        
        try {
            const { extractedData } = result;
            const payload = {
                reason,
                etc: etc || extractedData?.amount?.toString() || '0',
                price: extractedData?.amount || 0,
                cardNo: cardNo || '법인카드',
                content: `<img src="/api/upload/image/${uploadId}" />`,
                start: extractedData?.date?.split(' ')[0] || new Date().toISOString().split('T')[0],
                merchant: extractedData?.merchant || ''
            };

            const response = await axios.post('/api/payment', payload);
            
            if (response.status === 200) {
                setSaveSuccess(true);
                // Trigger a global refresh if needed, or let user know
                if (window.location.pathname === '/approval') {
                    // Quick hack to refresh table if on approval page
                    window.location.reload();
                }
            } else {
                throw new Error(response.data || '저장에 실패했습니다.');
            }
        } catch (err) {
            console.error('Save Error:', err);
            setError(err.response?.data || err.message || '결재 신청 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        const { content, extractedData, observation, reasoning } = result;

        return (
            <Fade in={!!result}>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Divider>
                        <Chip icon={<ScanSearch size={14} />} label="AI 분석 결과" color="primary" variant="outlined" />
                    </Divider>
                    
                    <Alert severity="success" icon={<CheckCircle size={20} />}>
                        <AlertTitle sx={{ fontWeight: 700 }}>분석 완료</AlertTitle>
                        {observation || "영수증 데이터 추출에 성공했습니다."}
                    </Alert>

                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'var(--bg-secondary)', borderStyle: 'dashed' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Store size={16} /> 추출된 정보
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">가맹점</Typography>
                                <Typography variant="body2" fontWeight="600">{extractedData?.merchant || '미확인'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">결제 금액</Typography>
                                <Typography variant="body2" fontWeight="600" color="primary">
                                    {extractedData?.amount ? `${Number(extractedData.amount).toLocaleString()}원` : '미확인'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">결제일</Typography>
                                <Typography variant="body2" fontWeight="600">{extractedData?.date || '미확인'}</Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Box sx={{ p: 1.5, bgcolor: 'var(--card-bg)', borderRadius: 2, border: '1px solid var(--border-color)' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                            AI 에이전트 브리핑
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {content}
                        </Typography>
                    </Box>

                    {!saveSuccess ? (
                        <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #3b82f630', bgcolor: '#3b82f605' }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#3b82f6' }}>
                                결재 신청 정보 입력
                            </Typography>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1}>
                                    <TextField 
                                        label="용도" size="small" fullWidth value={reason} 
                                        onChange={(e) => setReason(e.target.value)} 
                                        sx={{ bgcolor: 'var(--card-bg)' }}
                                    />
                                    <TextField 
                                        label="카드번호" size="small" fullWidth value={cardNo} 
                                        placeholder="법인카드"
                                        onChange={(e) => setCardNo(e.target.value)}
                                        sx={{ bgcolor: 'var(--card-bg)' }}
                                    />
                                </Stack>
                                <TextField 
                                    label="상세 내용" size="small" fullWidth value={etc} 
                                    onChange={(e) => setEtc(e.target.value)}
                                    sx={{ bgcolor: 'var(--card-bg)' }}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSave}
                                    disabled={saving}
                                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CheckCircle size={18} />}
                                    sx={{ 
                                        bgcolor: '#3b82f6', 
                                        fontWeight: 700, py: 1, borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    {saving ? '저장 중...' : '결재 신청하기'}
                                </Button>
                            </Stack>
                        </Paper>
                    ) : (
                        <Alert severity="success" sx={{ borderRadius: 3 }}>
                            <AlertTitle sx={{ fontWeight: 800 }}>신청 완료!</AlertTitle>
                            결재 신청이 성공적으로 상신되었습니다. 결재 내역에서 확인하실 수 있습니다.
                        </Alert>
                    )}
                </Box>
            </Fade>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            {!previewUrl ? (
                <Paper
                    variant="outlined"
                    sx={{
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        border: '2px dashed var(--border-color)',
                        bgcolor: 'var(--bg-secondary)',
                        transition: 'all 0.2s',
                        '&:hover': {
                            borderColor: 'var(--text-active)',
                            bgcolor: 'var(--bg-active)',
                            opacity: 0.1
                        }
                    }}
                    onClick={() => fileInputRef.current.click()}
                >
                    <Box sx={{ p: 2, bgcolor: 'var(--card-bg)', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Camera size={32} color="var(--text-secondary)" />
                    </Box>
                    <Typography variant="body2" color="var(--text-secondary)" fontWeight="600">
                        영수증 사진을 업로드하거나 촬영하세요
                    </Typography>
                    <Typography variant="caption" color="var(--text-secondary)">
                        (JPG, PNG, WebP 지원)
                    </Typography>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Paper>
            ) : (
                <Box>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            position: 'relative', 
                            borderRadius: 3, 
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            bgcolor: '#000',
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img 
                            src={previewUrl} 
                            alt="Receipt Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        />
                        <IconButton 
                            size="small" 
                            onClick={handleClear}
                            sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8, 
                                bgcolor: 'rgba(0,0,0,0.5)', 
                                color: '#fff',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                        >
                            <X size={18} />
                        </IconButton>
                    </Paper>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }} icon={<AlertTriangle size={20} />}>
                            {error}
                        </Alert>
                    )}

                    {!result && (
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            onClick={handleScan}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ScanSearch size={20} />}
                            sx={{ 
                                mt: 2, 
                                py: 1.5, 
                                borderRadius: 2,
                                fontWeight: 700,
                                bgcolor: 'var(--text-active)',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            {loading ? 'AI 분석 중...' : 'AI 스캔 시작'}
                        </Button>
                    )}
                </Box>
            )}

            {renderResult()}
        </Box>
    );
};

export default ReceiptScanner;
