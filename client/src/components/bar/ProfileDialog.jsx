import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

const ProfileDialog = ({user, openDialog, handleCloseDialog}) => {

    const userKeys = Object.keys(user).slice(0, 3)
    const userValues = Object.values(user).slice(0, 3)

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>프로필 상세 정보</DialogTitle>
            <DialogContent>
                {userKeys.map((item, index) => {
                    return (
                        <TextField
                            margin='dense'
                            id={item}
                            name={item}
                            label={item}
                            fullWidth
                            variant='standard'
                            value={userValues[index]}
                            key={index}
                            InputProps={{readOnly: true}}
                            autoComplete='false'
                        />
                    )}
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} variant='outlined'>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfileDialog