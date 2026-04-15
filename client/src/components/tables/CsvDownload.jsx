import { Button } from '@mui/material'
import { CSVLink } from 'react-csv'

const CsvDownload = ({ data, csvHeaders, fileName, customButton }) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null

    const linkContent = customButton || 'CSV Download'

    if (customButton) {
        return (
            <CSVLink
                data={data}
                headers={csvHeaders}
                filename={fileName}
                style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {customButton}
            </CSVLink>
        )
    }

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
                {linkContent}
            </CSVLink>
        </Button>
    )
}

export default CsvDownload

