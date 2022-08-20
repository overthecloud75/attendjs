import { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'

const Update = ({page, columns, open, setOpen, rowData}) => {

    const [focus, setFocus] = useState('info')
    const [value, setValue] = useState(
        {
            _id: rowData._id,
            owner: rowData.owner,
            info: rowData.info
        }
    )
    const handleClose = () => {
        setOpen(false)
    };

    const handleUpdate = async () => {
        const url = '/' + page + '/update'
        try {
            const res = await axios.post(url, value)
            rowData.info = value.info
            rowData.owner = value.owner
        } catch (err) {
            console.log(url, err)
        }
        handleClose()
    }

    const handleChange = (e) => {
        setFocus(e.target.id)
        setValue(
           {
                ...value,
                [e.target.id]: e.target.value
           }
        )    
    }

    const RowText = () => {

        return (
            columns.map((item, index) => 
                {   
                    return (
                        ['info', 'owner'].includes(item.accessor)
                            ?(
                                <TextField
                                    autoFocus={item.accessor===focus?true:false}
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='standard'
                                    value={value[item.accessor]?value[item.accessor]:''}
                                    key={index}
                                    onChange={handleChange}
                                />
                            )
                            :(
                                <TextField
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='standard'
                                    value={rowData[item.accessor]?rowData[item.accessor]:''}
                                    key={index}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            )
                    )
                }
            )
        )
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update {page}</DialogTitle>
            <DialogContent>
                <RowText/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Update