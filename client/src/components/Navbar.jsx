import styled from "styled-components";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Link } from "react-router-dom";
import { useState } from "react";

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

const itemList = [
    {
        to: '/attend', 
        icon: <DirectionsRunIcon/>,
        title: 'Attend'
    },
    {    
        to: '/wifi-attend',
        icon: <WifiFindIcon/>,
        title: 'Wifi-Attend'
    }, 
    {
        to: '/summary',
        icon: <SummarizeIcon/>,
        title: 'Summary'
    },
    {
        to: '/schedule',
        icon: <CalendarMonthIcon/>,
        title: 'Schedule'
    },
    {
        to: '/users',
        icon: <PeopleIcon/>,
        title: 'Users'
    },
    {
        to: '/board',
        icon: <NoteAltIcon/>,
        title: 'Board'
    },
]

const NavbarItem = () => {
    const [activeIndex, setActiveIndex] = useState(-1)
    return (
        itemList.map((item, index) => (
            <Item 
                to={item.to} 
                key={index} 
                onClick={() => setActiveIndex(index)}
                active={activeIndex===index?1:0}
            >
                {item.icon}
                <span>{item.title}</span>
            </Item>
        ))
    )
}

const Navbar = () => {
    return (
        <Items>
            <NavbarItem/>
        </Items>
    )
}

export default Navbar