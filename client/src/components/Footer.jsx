import styled from 'styled-components'

const Wrapper = styled.div`
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    position: absolute;
    @media screen and (max-height: 800px) {
        display: none;
    }
`

const Footer = () => {
    return (
        <Wrapper>
            Copyright © 2023 SmartWork.
        </Wrapper>
    )
}

export default Footer