import { CSVLink } from 'react-csv'

const CsvDownload = ({data, csvHeaders, fileName}) => {
    return (
        <button className='defaultButton'>
            <CSVLink 
                data={data}
                headers={csvHeaders}
                filename={fileName}
                style={{color: 'white', textDecoration: 'none'}}
            >
                CSV download
            </CSVLink>
        </button>
    )
}
  
export default CsvDownload

