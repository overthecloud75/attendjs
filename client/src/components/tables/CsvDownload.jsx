import { Button } from '@mui/material'
import { CSVLink } from 'react-csv'

const CsvDownload = ({ data, csvHeaders, fileName }) => {
    return (
        <Button
            variant='outlined'
            color='info'
            sx={{
                textTransform: 'none',   // 버튼 텍스트 대문자 변환 해제
                px: 2,
                py: 1,
            }}
        >
            <CSVLink
                data={data}
                headers={csvHeaders}
                filename={fileName}
                style={{
                color: 'inherit',        // 버튼 텍스트 색상 상속
                textDecoration: 'none',  // 링크 밑줄 제거
                }}
            >
                CSV Download
            </CSVLink>
        </Button>
    )
}

export default CsvDownload

