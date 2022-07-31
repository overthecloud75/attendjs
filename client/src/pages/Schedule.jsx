import styled from "styled-components";
import Calendar from '../components/Calendar';

const Container = styled.div`
    margin: 20px 50px;
    height: 100%;
`;

const Schedule = () => {
    return (
        <Container>
            <Calendar/>
        </Container>
    )
}

export default Schedule