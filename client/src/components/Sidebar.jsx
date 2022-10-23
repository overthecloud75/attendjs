import styled from 'styled-components'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind'
import SummarizeIcon from '@mui/icons-material/Summarize'
import ComputerIcon from '@mui/icons-material/Computer'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleIcon from '@mui/icons-material/People'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import FolderIcon from '@mui/icons-material/Folder'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Wrapper = styled.div`
    flex: 1;
    border-right: 0.5px solid rgb(230, 227, 227);
    min-height: 100vh;
    background-color: white;
`

const Top = styled.div`
    display: flex;  
    height: 50px; 
    align-items: center;
    justify-content: center;
`

const Middle = styled.div`
    padding-left: 10px;
`

const Bottom = styled.div`
    display: flex;  
    margin: 10px;
    align-items: center;
    justify-content: center;
`

const Logo = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: #6439ff;
`

const Items = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`

const Title = styled.div`
    font-size: 10px;
    font-weight: bold;
    color: #999;
    margin-top: 15px;
    margin-bottom: 5px;
`

const Item = styled.li`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 5px;
    cursor: pointer;

    &:hover {
    background-color: #ece8ff;
    }

    border: ${props => props.active ? '1px solid black' : 'none'};
    border-radius: ${props => props.active ? '20px' : 'none'};
` 

const Icon = styled.div`
    font-size: 30px;
    color: #7451f8;
` 

const Span = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: #888;
    margin-left: 10px;
`

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
`

const itemDict = 
    {
        Attendance : [
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
            }
        ],
    Management : [
        {
            to: '/device',
            icon: <ComputerIcon/>,
            title: 'Device'
        }
    ],
    Communaity : [
        {
            to: '/employee',
            icon: <PeopleIcon/>,
            title: 'Employee'
        },
        {
            to: '/board',
            icon: <NoteAltIcon/>,
            title: 'Board'
        },
        {
            to: '/report',
            icon: <FolderIcon/>,
            title: 'Report'
        }
    ]
}

const SidebarItems = ({itemList, titleIndex, activeTitleIndex, activeItemIndex, handleClick}) => {
    return (
        itemList.map((item, itemIndex) => (
            <Link 
                to={item.to} 
                style={{ textDecoration: 'none' }}
                key={itemIndex}
                >
                <Item
                    onClick={() => handleClick(titleIndex, itemIndex)}
                    active={activeTitleIndex===titleIndex&activeItemIndex===itemIndex?1:0}    
                >
                    <Icon>{item.icon}</Icon>
                    <Span>{item.title}</Span>
                </Item>
            </Link>
        ))
    )
}

const SidebarCategories = () => {
    const [activeTitleIndex, setActiveTitleIndex] = useState(-1)
    const [activeItemIndex, setActiveItemIndex] = useState(-1)
    const handleClick = (titleIndex, itemIndex) => {
        setActiveTitleIndex(titleIndex)
        setActiveItemIndex(itemIndex)
    }
    return (
        Object.keys(itemDict).map((title, titleIndex) => (
            <div
                key={titleIndex}
            >
                <Title>{title}</Title>
                <SidebarItems
                    itemList = {itemDict[title]}
                    titleIndex = {titleIndex}
                    activeTitleIndex = {activeTitleIndex} 
                    activeItemIndex = {activeItemIndex}
                    handleClick = {handleClick}
                />
            </div>
        )
    ) 
    ) 
}

const Sidebar = () => {
    return (
        <Wrapper>
            <Top>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Logo>SmartWork</Logo>
                </Link>
            </Top>
            <Middle>
                <Items>
                    <SidebarCategories/>
                </Items>
            </Middle>
            <Bottom>
                <Color Options/>
            </Bottom>
        </Wrapper>
    )
}

export default Sidebar