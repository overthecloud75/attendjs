import styled from "styled-components";

const Container = styled.div`
    height: 60px;
    background-color: #003580;
    display: flex;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 100%;
    max-width: 1024px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled.div`
    font-weight: 500;
`;

const Items = styled.div`
`
const Item = styled.button`
    margin-left: 20px;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    color: #003580;
`;

const Navbar = () => {
    return (
        <Container>
            <Wrapper> 
                <Logo>Attendance.com</Logo>
                <Items>
                    <Item>REGISTER</Item>
                    <Item>SIGN IN</Item>
                </Items>
            </Wrapper>
        </Container>
  )
}

export default Navbar