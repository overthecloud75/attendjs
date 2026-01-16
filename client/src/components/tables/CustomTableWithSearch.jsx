import { useState, Suspense, lazy } from 'react'
import { format } from 'date-fns'
import { Box } from '@mui/material'
import useFetch from '../../hooks/useFetch'
import Search from './Search'
import { SearchPages, SearchMonthPages } from '../../configs/pages'
import { LoadingSpinner } from '../../utils/GeneralUtil'

// Lazy load CustomTable to improve initial load performance
const CustomTable = lazy(() => import('./CustomTable'))

/**
 * Helper function to determine the initial date range based on the page type.
 * Returns an array with a single date range object compatible with react-date-range.
 */
const getInitialDate = (page) => {
    if (SearchMonthPages.includes(page)) {
        const today = new Date()
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(today.getMonth() - 1)
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

const CustomTableWithSearch = ({ menu, searchKeyword, page, url, columnHeaders, csvHeaders, onIdClick }) => {
    // State initialization
    const [name, setName] = useState('')
    // Use lazy initialization for date to avoid recalculating on every render
    const [date, setDate] = useState(() => getInitialDate(page))
    const [clickCount, setClickCount] = useState(0)
    const [fileName, setFileName] = useState(`${page}.csv`)

    // Fetch data based on search criteria
    const { data, setData, loading } = useFetch(
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
        <Box sx={{ width: '100%', position: 'relative' }}>
            {showSearch && (
                <Search
                    menu={menu}
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
            )}

            <Suspense fallback={<LoadingSpinner />}>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <CustomTable
                        page={page}
                        columns={columnHeaders}
                        data={data}
                        setData={setData}
                        fileName={fileName}
                        csvHeaders={csvHeaders}
                        onIdClick={onIdClick}
                    />
                )}
            </Suspense>
        </Box>
    )
}

export default CustomTableWithSearch