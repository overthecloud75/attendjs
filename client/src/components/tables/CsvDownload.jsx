import { Button } from '@mui/material'
import { CSVLink } from 'react-csv'

const CsvDownload = ({ data, csvHeaders, fileName }) => {
    return (
        <Button
            variant='outlined'
            color='info'
            sx={{
                textTransform: 'none',  
                px: 2,
                py: 0.7,
            }}
        >
            <CSVLink
                data={data}
                headers={csvHeaders}
                filename={fileName}
                style={{
                    color: 'inherit',        
                    textDecoration: 'none',  
                }}
            >
                CSV Download
            </CSVLink>
        </Button>
    )
}

export default CsvDownload

