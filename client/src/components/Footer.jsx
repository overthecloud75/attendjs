import styled from 'styled-components'

const Wrapper = styled.div`
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    position: absolute;
`

const Footer = () => {
    return (
        <Wrapper>
            Copyright © {(new Date().getFullYear())} SmartWork.
        </Wrapper>
    )
}

export default Footer