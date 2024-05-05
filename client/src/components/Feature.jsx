import styled from 'styled-components'
import EmployeesImg from '../assets/images/employees.webp'

const Container = styled.div`
    background-color: white;
    display: flex;
    margin: 20px 0px 0px 0px;
    justify-content: center;
`

const Image = styled.img`
    width: 95%;
    object-fit: cover;
`

const Feature = () => {
    return (
        <Container>
            <Image src={EmployeesImg}/>
        </Container>
    )
}

export default Feature