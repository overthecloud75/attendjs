import { useMemo, useState} from 'react'
import { format } from 'date-fns'
import useFetch from '../hooks/useFetch'
import Table from './ReactTable'
import Search from './Search'

const TableWithSearch = ({searchKeyword, page, url, columnHeaders, csvHeaders}) => {
    const [name, setName] = useState('')
    const [date, setDate] = useState([{startDate: new Date(), endDate: new Date(), key: 'selection'}])

    const [clickCount, setClickCount] = useState(0)
    const [fileName, setFileName] = useState('download.csv')

    const {data, setData, loading, error} = useFetch(
        page, url, {[searchKeyword]: name, startDate: format(date[0].startDate, 'yyyy-MM-dd'), endDate: format(date[0].endDate, 'yyyy-MM-dd')}, clickCount
    )

    const columns = useMemo(() => columnHeaders, [columnHeaders])
    const tableData = useMemo(() => data, [data])

    return (
        <>
            <Search
                page={page}
                searchKeyword={searchKeyword}
                name={name}
                setName={setName}
                date={date}
                setDate={setDate}
                clickCount={clickCount}
                setClickCount={setClickCount}
                setFileName={setFileName}
            />
            <Table 
                url={page}
                columns={columns}
                data={tableData}
                setData={setData}
                fileName={fileName}
                csvHeaders={csvHeaders}
            />
        </>
    )
}

export default TableWithSearch