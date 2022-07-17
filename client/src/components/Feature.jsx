import styled from "styled-components";
import EmployeesImg from "../assets/images/employees.jpg"

const Container = styled.div`
    background-color: white;
    display: flex;
    margin: 20px 0px 0px 0px;
    justify-content: center;
`;

const Image = styled.img`
    width: 100%;
    max-width: 1024px;
    object-fit: cover;
`;

const Feature = () => {
  return (
    <Container>
        <Image src={EmployeesImg}/>
    </Container>
  )
}

export default Feature