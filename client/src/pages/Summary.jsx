import TableWithSearch from '../components/TableWithSearch'
import { summaryColumnHeaders, summaryCsvHeaders } from '../config'

const Summary = () => {
    return (       
        <TableWithSearch 
            searchKeyword='name'
            page ='summary'
            url='/summary/search'
            columnHeaders={summaryColumnHeaders}
            csvHeaders={summaryCsvHeaders}
        />
    )
}

export default Summary