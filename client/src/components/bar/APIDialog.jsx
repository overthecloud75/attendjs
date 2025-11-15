import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Tooltip } from '@mui/material'
import { getApiKey, updateApiKey } from '../../utils/EventUtil'

const APIDialog = ({open, apiKey, handleClose}) => {

    const [value, setValue] = useState(apiKey)
    const [showKey, setShowKey] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const {data, error} = await getApiKey()
            if (!error) {
                setValue(data.apiKey)
            }
        }
        if (open) { fetchData() }
    }, [open])

    const handleUpdate = async () => {
        const { data, error } = await updateApiKey() 
        if (!error) {
            setValue(data.apiKey)
        } 
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false, 2000))
        } catch (err) {

        }
    }

    const getMaskedValue = (key) => {
        if (!key) return ''
        return showKey ? key: `${'*'.repeat(key.length)}`
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>API Key 정보</DialogTitle>
            <DialogContent>
                {value?
                    <TextField
                        margin='dense'
                        id='apiKey'
                        name='apiKey'
                        label=''
                        fullWidth
                        variant='standard'
                        value={getMaskedValue(value)}
                        key='0'
                        slotProps={{
                            input: {
                                readOnly: true,
                                endAdornment: (
                                    <>
                                        <Tooltip title={showKey ? 'API Key 숨기기' : 'API key 보기'}>
                                            <IconButton onClick={() => setShowKey(!showKey)}>
                                                {showKey ? '🙈' : '👁️'}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={copySuccess ? '복사됨!' : '복사하기'}>
                                            <IconButton onClick={handleCopy}>
                                                📋
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                ),
                            },
                        }}
                        autoComplete='false'
                    />:
                    <TextField
                        margin='dense'
                        id='apiKey'
                        name='apiKey'
                        label='API Key가 생성이 안 되었습니다.'
                        fullWidth
                        variant='standard'
                        value={value}
                        key='0'
                        slotProps={{
                            input: {
                            readOnly: true,
                            },
                        }}
                        autoComplete='false'
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdate} variant='outlined'>{value ? 'Update' : 'New'}</Button>
                <Button onClick={handleClose} variant='outlined'>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default APIDialog