import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TableWithSearch from '../components/TableWithSearch'
import { summaryColumnHeaders, summaryCsvHeaders } from '../config'
import Footer from '../components/Footer'

const Container = styled.div`
    display: flex;
`
const Wrapper = styled.div`
    flex: 8;
`
const Summary = () => {
    return (
        <Container>
            <Sidebar/>
            <Wrapper>  
                <Navbar/>   
                <TableWithSearch 
                    searchKeyword='name'
                    page ='summary'
                    url='/summary/search'
                    columnHeaders={summaryColumnHeaders}
                    csvHeaders={summaryCsvHeaders}
                />
                <Footer/>
            </Wrapper>
        </Container>
    )
}

export default Summary