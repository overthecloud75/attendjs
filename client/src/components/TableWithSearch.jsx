import { useMemo, useState, useEffect, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import useFetch from '../hooks/useFetch'
import Search from './Search'

const Table = lazy(() => import('./ReactTable'))

const TableWithSearch = ({searchKeyword, page, url, columnHeaders, csvHeaders}) => {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [date, setDate] = useState([{startDate: new Date(), endDate: new Date(), key: 'selection'}])

    const [clickCount, setClickCount] = useState(0)
    const [fileName, setFileName] = useState('download.csv')

    // eslint-disable-next-line
    const {data, setData, loading, error} = useFetch(
        page, url, {[searchKeyword]: name, startDate: format(date[0].startDate, 'yyyy-MM-dd'), endDate: format(date[0].endDate, 'yyyy-MM-dd')}, clickCount
    )

    useEffect(() => {
        const fetchData = () => {
            if (error) {
                const errorStatus = error.response.data.status
                if (errorStatus === 401) { 
                    // 401 Unauthorized
                    navigate('/login')
                } else if (errorStatus === 429) {
                    // 429 too many requests
                    navigate('/too-many-requests')
                }
            }
        }
        fetchData()
    // eslint-disable-next-line
    }, [error])

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
            <Suspense fallback={<div>Loading...</div>}>
                <Table 
                    url={page}
                    columns={columns}
                    data={tableData}
                    setData={setData}
                    fileName={fileName}
                    csvHeaders={csvHeaders}
                />
            </Suspense>
        </>
    )
}

export default TableWithSearch