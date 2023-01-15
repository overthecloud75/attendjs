import styled from 'styled-components'

const Container = styled.div`
    background-color: white;
    display: flex;
    justify-content: center;
    position: relative;
`

const Wrapper = styled.div`
    width: 100%;
    max-width: 1024px;
    margin: 0px 0px 10px 0px;
`

const Title = styled.h1`
    margin: 15px 0px 0px 7px;
    @media screen and (max-width: 500px) {
        font-size: 20px;
    }
`

const TitleDesc = styled.div`
    margin: 5px 0px 0px 7px;
    @media screen and (max-width: 500px) {
        font-size: 15px;
    }
`

const Advertisement = () => {
    return (
        <Container>
            <Wrapper>
                <Title>
                    진정한 SmartWork의 시작
                </Title>
                <TitleDesc>
                    사람과 사람, 그 관계를 만드는
                </TitleDesc>
            </Wrapper>
        </Container>
    )
}

export default Advertisement