import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex: 1;
    text-align: center;
    width: 100%;
    @media screen and (max-width: 800px) {
        display: none
    }
`

const Wrapper = styled.div`
    width: 100%;
    max-width: 1024px;
    margin: 0;
    padding: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
`

const Title = styled.h1`
    margin: 15px 0 0 0;
    padding: 0;
    text-align: center;
    width: 100%;
    font-size: 40px;
    @media screen and (max-width: 500px) {
        font-size: 20px;
    }
`

const TitleDesc = styled.div`
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 25px;
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