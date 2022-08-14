import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { attendColumnHeaders, attendCsvHeaders } from '../config'
import Footer from '../components/Footer'

const Container = styled.div`
    display: flex;
`
const Wrapper = styled.div`
    flex: 8;
    position: relative;
`
const Attend = () => {
    return (     
        <Container>
            <Sidebar/>
            <Wrapper>
                <Navbar/>
                <TableWithSearch 
                    searchKeyword='name'
                    page='attend'
                    url='/attend/search'
                    columnHeaders={attendColumnHeaders}
                    csvHeaders={attendCsvHeaders}
                />
                <Footer/>
            </Wrapper>
        </Container>  
    )
}

export default Attend