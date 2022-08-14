import TableWithSearch from '../components/TableWithSearch'
import { wifiColumnHeaders, wifiCsvHeaders } from '../config'

const Wifi = () => {
    return (       
        <TableWithSearch 
            searchKeyword='ip'
            page='wifi-attend'
            url='/wifi-attend/search'
            columnHeaders={wifiColumnHeaders}
            csvHeaders={wifiCsvHeaders}
        />
    )
}

export default Wifi