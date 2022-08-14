import TableWithSearch from '../components/TableWithSearch'
import { deviceColumnHeaders, deviceCsvHeaders } from '../config'

const Device = () => {
    return (       
        <TableWithSearch 
            searchKeyword='mac'
            page ='device'
            url='/device/search'
            columnHeaders={deviceColumnHeaders}
            csvHeaders={deviceCsvHeaders}
        />
    )
}

export default Device