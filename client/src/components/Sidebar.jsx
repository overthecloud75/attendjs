import { useState } from 'react'
import styled from 'styled-components'
import { Tooltip } from 'react-tooltip'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import SummarizeIcon from '@mui/icons-material/Summarize'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlaceIcon from '@mui/icons-material/Place'
import ComputerIcon from '@mui/icons-material/Computer'
import PeopleIcon from '@mui/icons-material/People'
import BookIcon from '@mui/icons-material/Book'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import FolderIcon from '@mui/icons-material/Folder'
import { Link } from 'react-router-dom'
import { getUser } from '../storage/userSlice.js'

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
    @media screen and (max-width: 600px) {
        padding-left: 0px;
    }
`

const Bottom = styled.div`
    display: flex;  
    margin: 10px;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 600px) {
        margin: 0px;
    }
`

const Logo = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: #6439ff;
    @media screen and (max-width: 600px) {
        font-size: 7px;
    }
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
    @media screen and (max-width: 600px) {
        display: none;
    }
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

    @media screen and (max-width: 600px) {
        display: flex;
        height: 30px;
        padding: 0px;
        justify-content: center;
    }
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
    @media screen and (max-width: 600px) {
        display: none;
        margin-left: 0px;
    }
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

    @media screen and (max-width: 600px) {
        margin-left: 0px;
        margin-right: 0px;
        justify-content: center;
    }
}
`

const itemDict = 
    {
        Attendance : [
            {
                to: '/attend', 
                icon: <DirectionsRunIcon/>,
                title: 'Attend',
                auth: true
            },
            {    
                to: '/wifi-attend',
                icon: <WifiFindIcon/>,
                title: 'Wifi-Attend',
                auth: false
            }, 
            {    
                to: '/gps-attend',
                icon: <GpsFixedIcon/>,
                title: 'GPS-Attend',
                auth: true
            }, 
            {
                to: '/summary',
                icon: <SummarizeIcon/>,
                title: 'Summary',
                auth: true
            },
            {
                to: '/schedule',
                icon: <CalendarMonthIcon/>,
                title: 'Schedule',
                auth: true
            },
            {
                to: '/location',
                icon: <PlaceIcon/>,
                title: 'Location',
                auth: false
            }
        ],
    Management : [
        {
            to: '/employee',
            icon: <PeopleIcon/>,
            title: 'Employee',
            auth: true
        },
        {
            to: '/device',
            icon: <ComputerIcon/>,
            title: 'Device',
            auth: true
        }
    ],
    Communaity : [
        {
            to: '/approvalhistory',
            icon: <AssignmentTurnedInIcon/>,
            title: 'ApprovalHistory',
            auth: true
        },
        {
            to: '/board',
            icon: <NoteAltIcon/>,
            title: 'Board',
            auth: true
        },
        {
            to: '/report',
            icon: <FolderIcon/>,
            title: 'Report',
            auth: false
        },
        {
            to: '/loginhistory',
            icon: <BookIcon/>,
            title: 'LoginHistory',
            auth: false
        },
    ]
}

const SidebarItems = ({itemList, titleIndex, activeTitleIndex, activeItemIndex, handleClick}) => {
    const user = getUser()
    return (
        itemList.map((item, itemIndex) => (
            <Link 
                to={item.to} 
                style={{ textDecoration: 'none' }}
                key={itemIndex}
                >
                {(item.auth || user.isAdmin) &&
                    <Item
                        onClick={() => handleClick(titleIndex, itemIndex)}
                        active={activeTitleIndex===titleIndex&&activeItemIndex===itemIndex}    
                    >
                        <Icon
                            data-tooltip-id={window.innerWidth<600 && item.title}
                            data-tooltip-content={item.title}
                        >
                            {item.icon}    
                        </Icon>
                        <Span>{item.title}</Span>
                        <Tooltip id={item.title} place='top' type='dark' effect='float' />
                    </Item>
                }
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
        )) 
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
                <Color/> 
            </Bottom>
        </Wrapper>
    )
}

export default Sidebar