import styled from 'styled-components'

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
            <Image src="/employees.webp"/>
        </Container>
    )
}

export default Feature