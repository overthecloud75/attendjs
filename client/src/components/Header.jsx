import styled from "styled-components";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Link } from "react-router-dom";

const Container = styled.div`
    background-color: #003580;
    color: white;
    display: flex;
    justify-content: center;
    position: relative;
`;

const Wrapper = styled.div`
    width: 100%;
    max-width: 1024px;
    margin: 10px 0px 10px 0px;
`;

const Items = styled.div`
    display: flex;
    gap: 40px;
    margin-bottom: 10px;
`;

const Item = styled(Link)`
    display: flex;
    align-items: center;
    gap: 10px;
    border: ${props => props.active ? "1px solid white" : "none"};
    border-radius: ${props => props.active ? "20px" : "none"};
    padding: ${props => props.active ? "10px" : "none"};
`;   

const Header = () => {
  return (
    <Container>
        <Wrapper>
            <Items>
                <Item to="/attend" active="true">
                    <DirectionsRunIcon/>
                    <span>Attend</span>
                </Item>
                <Item to="/wifi-attend">
                    <WifiFindIcon/>
                    <span>Wifi-Attend</span>
                </Item>
                <Item to="/summary">
                    <SummarizeIcon/>
                    <span>Summary</span>
                </Item>
                <Item to="/calendar">
                    <CalendarMonthIcon/>
                    <span>Calendar</span>
                </Item>
                <Item to="/users">
                    <PeopleIcon/>
                    <span>Users</span>
                </Item>
                <Item to="/board">
                    <NoteAltIcon/>
                    <span>Board</span>
                </Item>
            </Items>
        </Wrapper>
    </Container>
  )
}

export default Header