import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { wifiColumnHeaders, wifiCsvHeaders } from '../config'
import Footer from '../components/Footer'

const Container = styled.div`
    display: flex;
`

const Wrapper = styled.div`
    flex: 8;
`
const Wifi = () => {
    return (   
        <Container>
            <Sidebar/>
            <Wrapper> 
                <Navbar/>   
                <TableWithSearch 
                    searchKeyword='ip'
                    page='wifi-attend'
                    url='/wifi-attend/search'
                    columnHeaders={wifiColumnHeaders}
                    csvHeaders={wifiCsvHeaders}
                />
                <Footer/>
            </Wrapper>
        </Container>
    )
}

export default Wifi