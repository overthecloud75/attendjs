import styled from "styled-components";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Link } from "react-router-dom";

const Items = styled.div`
    display: flex;
    flex-direction: column;
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

const Navbar = () => {
  return (
    <Items>
        <Item to='/attend' active="true">
            <DirectionsRunIcon/>
            <span>Attend</span>
        </Item>
        <Item to='/wifi-attend'>
            <WifiFindIcon/>
            <span>Wifi-Attend</span>
        </Item>
        <Item to='/summary'>
            <SummarizeIcon/>
            <span>Summary</span>
        </Item>
        <Item to='/schedule'>
            <CalendarMonthIcon/>
            <span>Schedule</span>
        </Item>
        <Item to='/users'>
            <PeopleIcon/>
            <span>Users</span>
        </Item>
        <Item to="/board">
            <NoteAltIcon/>
            <span>Board</span>
        </Item>
    </Items>
  )
}

export default Navbar