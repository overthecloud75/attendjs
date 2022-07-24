import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Logo = styled(Link)`
    font-weight: 500;
    margin-bottom: 10px;
`;

const Items = styled.div`
    display: flex;
    flex-direction: column;
`
const Item = styled.button`
    margin-bottom: 10px;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    color: #003580;
`;

const Header = () => {
    return (
        <Container>
            <Logo to="/">Attendance.com</Logo>
            <Items>
                <Item>REGISTER</Item>
                <Item>SIGN IN</Item>
            </Items>
        </Container>
  )
}

export default Header