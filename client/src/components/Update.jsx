import { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'

const Update = ({page, columns, data, setData, open, setOpen, rowData}) => {

    const [value, setValue] = useState(
        {
            _id: rowData._id,
            owner: rowData.owner,
            info: rowData.info,
            location: rowData.location
        }
    )
    const handleClose = () => {
        setOpen(false)
    };

    const updateData = (rowData) => {
        let tableData = []
        data.map((prev) => (
            prev._id === rowData._id?tableData.push(rowData):tableData.push(prev)
        ))
        setData(tableData)
    }

    const handleUpdate = async () => {
        const url = '/' + page + '/update'
        if (page==='device') {
            try {
                const res = await axios.post(url, value)
                rowData.info = value.info
                rowData.location = value.location
                updateData(rowData)
            } catch (err) {
                console.log(url, err)
            }
        }
        handleClose()
    }

    const handleChange = (e) => {
        console.log(e.target.id, e.target.value)
        setValue(
           {
                ...value,
                [e.target.id]: e.target.value
           }
        )    
    }
    // autofocus disappear after typing, 한글 입력 문제 
    // https://stackoverflow.com/questions/42573017/in-react-es6-why-does-the-input-field-lose-focus-after-typing-a-character

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update {page}</DialogTitle>
            <DialogContent>
                {
                    columns.map((item, index) => {
                        return (
                            ['info', 'location'].includes(item.accessor)?(
                                <TextField
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='outlined'
                                    value={value[item.accessor]?value[item.accessor]:''}
                                    key={index}
                                    onChange={handleChange}
                                />
                            ):(
                                <TextField
                                    margin='dense'
                                    id={item.accessor}
                                    label={item.accessor}
                                    fullWidth
                                    variant='standard'
                                    value={rowData[item.accessor]?rowData[item.accessor]:''}
                                    key={index}
                                    InputProps={{readOnly: true}}
                                />
                            )
                        )
                    })
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Update