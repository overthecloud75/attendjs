import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Advertisement from '../components/Advertisement'
import Feature from '../components/Feature'
import Footer from '../components/Footer'

const Container = styled.div`
    display: flex;
`
const Wrapper = styled.div`
    flex: 8;
`
const Home = () => {
    return (
        <Container>
            <Sidebar/>
            <Wrapper>
                <Navbar/> 
                <Advertisement/>
                <Feature/>
                <Footer/>
            </Wrapper>
        </Container>
    )
}

export default Home