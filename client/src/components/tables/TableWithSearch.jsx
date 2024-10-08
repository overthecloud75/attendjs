import { useState, useEffect, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Box, CircularProgress } from '@mui/material'
import useFetch from '../../hooks/useFetch'
import Search from './Search'
import { SearchPages } from '../../configs/pages'

const Table = lazy(() => import('./Table'))

const TableWithSearch = ({searchKeyword, page, url, columnHeaders, csvHeaders}) => {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [date, setDate] = useState([{startDate: new Date(), endDate: new Date(), key: 'selection'}])

    const [clickCount, setClickCount] = useState(0)
    const [fileName, setFileName] = useState('download.csv')

    // eslint-disable-next-line
    const {data, setData, loading, error} = useFetch(
        page, url, {[searchKeyword]: name, startDate: format(date[0].startDate, 'yyyy-MM-dd'), endDate: format(date[0].endDate, 'yyyy-MM-dd')}, clickCount
    )

    useEffect(() => {
        if (error) {
            const errorStatus = error.response.data.status
            if (errorStatus === 401) { 
                // 401 Unauthorized
                sessionStorage.removeItem('user')
                navigate('/login')
            } else if (errorStatus === 429) {
                // 429 too many requests
                navigate('/too-many-requests')
            }
        }
    // eslint-disable-next-line
    }, [error, navigate])

    const showSearch = SearchPages.includes(page)

    return (
        <>
            {showSearch&&<Search
                page={page}
                searchKeyword={searchKeyword}
                name={name}
                setName={setName}
                date={date}
                setDate={setDate}
                clickCount={clickCount}
                setClickCount={setClickCount}
                setFileName={setFileName}
            />}
            <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress/>
                </Box>
            }>
                <Table 
                    url={page}
                    columns={columnHeaders}
                    data={data}
                    setData={setData}
                    fileName={fileName}
                    csvHeaders={csvHeaders}
                />
            </Suspense>
        </>
    )
}

export default TableWithSearch