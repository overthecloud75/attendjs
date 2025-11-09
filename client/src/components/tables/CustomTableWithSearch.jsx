import { useState, Suspense, lazy } from 'react'
import { format } from 'date-fns'
import useFetch from '../../hooks/useFetch'
import Search from './Search'
import { SearchPages, SearchMonthPages } from '../../configs/pages'
import { LoadingSpinner } from '../../utils/GeneralUtil'

const CustomTable = lazy(() => import('./CustomTable'))

const getInitialDate = (page) => {
    if (SearchMonthPages.includes(page)) { 
        const today = new Date()
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return [{
            startDate: oneMonthAgo,
            endDate: today,
            key: 'selection'
        }]
    }
    return [{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]
}

const CustomTableWithSearch = ({searchKeyword, page, url, columnHeaders, csvHeaders}) => {
    const [name, setName] = useState('')
    const [date, setDate] = useState(getInitialDate(page))

    const [clickCount, setClickCount] = useState(0)
    const [fileName, setFileName] = useState(`${page}.csv`)

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
                    <CustomTable 
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

export default CustomTableWithSearch