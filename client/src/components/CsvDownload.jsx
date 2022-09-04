import { CSVLink } from "react-csv"

const CsvDownload = ({data, csvHeaders, fileName}) => {
    return (
        <button className='defaultButton'>
            <CSVLink 
                data={data}
                headers={csvHeaders}
                filename={fileName}
            >
                CSV download
            </CSVLink>
        </button>
    )
}
  
export default CsvDownload

