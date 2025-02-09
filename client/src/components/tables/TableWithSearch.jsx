import { useState, Suspense, lazy } from 'react'
import { format } from 'date-fns'
import useFetch from '../../hooks/useFetch'
import Search from './Search'
import { SearchPages } from '../../configs/pages'
import { LoadingSpinner } from '../../utils/GeneralUtil'

const Table = lazy(() => import('./Table'))

const TableWithSearch = ({searchKeyword, page, url, columnHeaders, csvHeaders}) => {
    const [name, setName] = useState('')
    const [date, setDate] = useState([{startDate: new Date(), endDate: new Date(), key: 'selection'}])

    const [clickCount, setClickCount] = useState(0)
    const [fileName, setFileName] = useState('download.csv')

    // eslint-disable-next-line
    const {data, setData, loading } = useFetch(
        page, 
        url, 
        {
            [searchKeyword]: name, 
            startDate: format(date[0].startDate, 'yyyy-MM-dd'), 
            endDate: format(date[0].endDate, 'yyyy-MM-dd')
        }, 
        clickCount
    )

    const showSearch = SearchPages.includes(page)

    return (
        <>
            {showSearch && 
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
            }
            <Suspense fallback={<LoadingSpinner/>}> 
                {loading ? <LoadingSpinner/> : (
                    <Table 
                        url={page}
                        columns={columnHeaders}
                        data={data}
                        setData={setData}
                        fileName={fileName}
                        csvHeaders={csvHeaders}
                    />

                )}
            </Suspense>
        </>
    )
}

export default TableWithSearch