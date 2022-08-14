import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Calendar from '../components/Calendar'
import Footer from '../components/Footer'

const Container = styled.div`
    display: flex;
`
const Wrapper = styled.div`
    flex: 8;
`
const Schedule = () => {
    return (
        <Container>
            <Sidebar/>
            <Wrapper>
                <Navbar/>
                <Calendar/>
                <Footer/>
            </Wrapper>
        </Container>
    )
}

export default Schedule