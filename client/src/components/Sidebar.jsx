import styled from 'styled-components'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind'
import SummarizeIcon from '@mui/icons-material/Summarize'
import ComputerIcon from '@mui/icons-material/Computer'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleIcon from '@mui/icons-material/People'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Wrapper = styled.div`
    flex: 1;
    border-right: 0.5px solid rgb(230, 227, 227);
    min-height: 100vh;
    background-color: white;
`;

const Top = styled.div`
    display: flex;  
    height: 50px; 
    align-items: center;
    justify-content: center;
`;

const Middle = styled.div`
    padding-left: 10px;
`;

const Bottom = styled.div`
    display: flex;  
    margin: 10px;
    align-items: center;
    justify-content: center;
`;

const Logo = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: #6439ff;
`;

const Hr = styled.hr`
    height: 0;
    border: 0.5px solid rgb(230, 227, 227);
`;

const Items = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 5px;
    cursor: pointer;

    &:hover {
    background-color: #ece8ff;
    }

    border: ${props => props.active ? "1px solid white" : "none"};
    border-radius: ${props => props.active ? "20px" : "none"};
    padding: ${props => props.active ? "10px" : "none"};
`; 

const Icon = styled.div`
    font-size: 30px;
    color: #7451f8;
`; 

const Span = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: #888;
    margin-left: 10px;
`; 

const Color = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #7451f8;
    cursor: pointer;
    margin: 5px;

    &:nth-child(1){
        background-color: whitesmoke;
    }
    &:nth-child(2){
        background-color: #333;
    }
    &:nth-child(3){
        background-color: darkblue;
    }
}
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
        to: '/device',
        icon: <ComputerIcon/>,
        title: 'Device'
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

const SidebarItem = () => {
    const [activeIndex, setActiveIndex] = useState(-1)
    return (
        itemList.map((item, index) => (
            <Link 
                to={item.to} 
                style={{ textDecoration: 'none' }}
                key={index} 
                >
                <Item 
                    onClick={() => setActiveIndex(index)}
                    active={activeIndex===index?1:0}
                >
                    <Icon>{item.icon}</Icon>
                    <Span>{item.title}</Span>
                </Item>
            </Link>
        ))
    )
}

const Sidebar = () => {
    return (
        <Wrapper>
            <Top>
                <Logo>Attendance</Logo>
            </Top>
            <Hr/>
            <Middle>
                <Items>
                    <SidebarItem/>
                </Items>
            </Middle>
            <Bottom>
                <Color Options/>
            </Bottom>
        </Wrapper>
    )
}

export default Sidebar