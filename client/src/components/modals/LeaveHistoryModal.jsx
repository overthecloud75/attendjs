import React from 'react'
import {
    Dialog, DialogTitle, DialogContent, IconButton, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Chip
} from '@mui/material'
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

const LeaveHistoryModal = ({ open, setOpen, employee }) => {

    const handleClose = () => {
        setOpen(false)
    }

    if (!employee) return null

    const historyList = employee.leaveHistory || []

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    backgroundImage: 'none' // MUI default overlay removal for dark mode
                }
            }}
        >
            <DialogTitle sx={{
                m: 0, p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                bgcolor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Calendar size={20} color="#3b82f6" />
                    <Typography variant="h6" fontWeight={700}>
                        {employee.name}님의 연차 상세 이력
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': { bgcolor: 'var(--hover-bg)' }
                    }}
                >
                    <X size={20} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, borderTop: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)' }}>
                {historyList.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                        <Typography color="var(--text-secondary)">상세 이력이 존재하지 않습니다.</Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--border-color)', borderRadius: 2, bgcolor: 'transparent' }}>
                        <Table sx={{ minWidth: 500 }} aria-label="history table">
                            <TableHead sx={{ bgcolor: 'var(--bg-secondary)' }}>
                                <TableRow>
                                    {['기수 (귀속년도)', '구분', '발생일', '만료일', '총 발생', '사용', '잔여', '상태'].map((head) => (
                                        <TableCell key={head} align="center" sx={{
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            borderBottom: '1px solid var(--border-color)'
                                        }}>
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyList.map((history, index) => {
                                    const isExpired = new Date(history.expiryDate) < new Date()
                                    const left = history.totalDays - history.usedDays
                                    const isActive = !isExpired

                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '& td, & th': { borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                                            }}
                                        >
                                            <TableCell align="center" component="th" scope="row" sx={{ fontWeight: 500, color: 'var(--text-primary) !important' }}>
                                                {history.nthYear}년차
                                            </TableCell>
                                            <TableCell align="center">
                                                {history.type === 'monthly' ? '1년미만(월차)' : '연차'}
                                            </TableCell>
                                            <TableCell align="center">
                                                {format(new Date(history.grantDate), 'yyyy-MM-dd')}
                                            </TableCell>
                                            <TableCell align="center">
                                                {format(new Date(history.expiryDate), 'yyyy-MM-dd')}
                                            </TableCell>
                                            <TableCell align="center">
                                                {history.totalDays}
                                            </TableCell>
                                            <TableCell align="center">
                                                {history.usedDays}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography
                                                    fontWeight={700}
                                                    color={left < 0 ? '#ef4444' : '#3b82f6'} // Use specific colors for better visibility in dark mode or vars
                                                >
                                                    {left}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {isActive ? (
                                                    <Chip label="사용중" color="primary" size="small" icon={<CheckCircle2 size={14} />} variant="outlined" />
                                                ) : (
                                                    <Chip label="만료됨" size="small" icon={<Clock size={14} />} variant="outlined" sx={{ color: 'var(--text-disabled)', borderColor: 'var(--border-color)' }} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Box mt={3} p={2} bgcolor="var(--bg-secondary)" borderRadius={2}>
                    <Box display="flex" gap={1} mb={1}>
                        <AlertCircle size={18} color="var(--text-secondary)" />
                        <Typography variant="subtitle2" fontWeight={600} color="var(--text-secondary)">
                            참고 사항
                        </Typography>
                    </Box>
                    <Typography variant="caption" display="block" color="var(--text-secondary)" gutterBottom>
                        • 2026년 1월 시스템 개편 이전의 과거 데이터는 마이그레이션된 합계입니다.
                    </Typography>
                    <Typography variant="caption" display="block" color="var(--text-secondary)">
                        • '잔여'가 음수인 경우 다음 해 연차를 미리 당겨쓴 것(Overdraft)을 의미합니다.
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default LeaveHistoryModal
