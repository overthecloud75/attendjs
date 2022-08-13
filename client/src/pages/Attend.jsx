import TableWithSearch from '../components/TableWithSearch'
import { attendColumnHeaders, attendCsvHeaders } from '../config'

const Attend = () => {
    return (       
        <TableWithSearch 
            page='attend'
            url='/attend/search'
            columnHeaders={attendColumnHeaders}
            csvHeaders={attendCsvHeaders}
        />
    )
}

export default Attend