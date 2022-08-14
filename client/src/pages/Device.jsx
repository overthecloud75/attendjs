import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { deviceColumnHeaders, deviceCsvHeaders } from '../config'
import Footer from '../components/Footer'


const Container = styled.div`
    display: flex;
`

const Wrapper = styled.div`
    flex: 8;
`
const Device = () => {
    return (    
        <Container>
            <Sidebar/>
            <Wrapper> 
                <Navbar/> 
                <TableWithSearch 
                    searchKeyword='mac'
                    page ='device'
                    url='/device/search'
                    columnHeaders={deviceColumnHeaders}
                    csvHeaders={deviceCsvHeaders}
                />
                <Footer/>
            </Wrapper> 
        </Container>
    )
}

export default Device