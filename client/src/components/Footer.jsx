import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    width: 1024px;
    font-size: 12px;
    margin-left: 20px;
`;

const Footer = () => {
    return (
        <Wrapper>
            Copyright © 2022 Attendance.
        </Wrapper>
    );
};

export default Footer;