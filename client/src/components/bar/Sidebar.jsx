import styled from 'styled-components'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import SummarizeIcon from '@mui/icons-material/Summarize'
import PlaceIcon from '@mui/icons-material/Place'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ComputerIcon from '@mui/icons-material/Computer'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PeopleIcon from '@mui/icons-material/People'
import BookIcon from '@mui/icons-material/Book'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import { Link } from 'react-router-dom'
import { getUser } from '../../storage/userSlice'

const Wrapper = styled.div`
    flex: 1;
    border-right: 1px solid #e1e5e9;
    min-height: 100vh;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
`

const Top = styled.div`
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: left;
    border-bottom: 1px solid #e1e5e9;
    background: #ffffff;    
    color: #333;             

    @media screen and (max-width: 600px) {
        height: 50px;
    }
`

const Middle = styled.div`
    padding: 20px 0;
    overflow-y: auto;
    max-height: calc(100vh - 140px);
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
    
    @media screen and (max-width: 600px) {
        padding: 10px 0;
    }
`

const Bottom = styled.div`
    display: flex;  
    margin: 20px;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e1e5e9;
    @media screen and (max-width: 600px) {
        padding: 5px;
        margin: 0px;
    }
`

const Logo = styled.span`
    font-size: 15px;
    font-weight: 700;
    color: #333;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.5px;
    @media screen and (max-width: 600px) {
        display: none;
    }
`

const Items = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`

const Title = styled.div`
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    margin: 25px 20px 10px 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 20px;
        height: 2px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 1px;
    }
    @media screen and (max-width: 600px) {
        display: none;
    }
`

const Item = styled.li`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    cursor: pointer;
    margin: 2px 10px;
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative;
    
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
    color: ${props => props.active ? 'white' : '#64748b'};
    
    &:hover {
        background: ${props => props.active 
            ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' 
            : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'};
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &.invisible {
        display: none;
    }

    @media screen and (max-width: 600px) {
        height: 30px;
        padding: 0px;
        justify-content: center;
    }
` 

const Icon = styled.div`
    font-size: 30px;
    color: #7451f8;

    ${Item}:hover & {
        color: #4a23d9;
    }
` 

const Span = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: #666;
    margin-left: 10px;

    ${Item}:hover & {
        color: #4a23d9;
    }

    @media screen and (max-width: 600px) {
        display: none;
        margin-left: 0px;
    }
`
const FootMessage = styled.div`
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    @media screen and (max-height: 800px), screen and (max-width: 600px) {
        display: none;
    }
`

const itemDict = 
    {
        Attendance : [
            {
                to: '/dashboard', 
                icon: <AccountBoxIcon/>,
                title: 'Dashboard',
                auth: true,
                visible: true
            },
            {
                to: '/attend', 
                icon: <DirectionsRunIcon/>,
                title: 'Attend',
                auth: true,
                visible: true
            },
            {    
                to: '/wifi-attend',
                icon: <WifiFindIcon/>,
                title: 'Wifi-Attend',
                auth: false, 
                visible: false
            }, 
            {    
                to: '/gps-attend',
                icon: <GpsFixedIcon/>,
                title: 'GPS-Attend',
                auth: true,
                visible: true
            }
        ],
    Management : [
        {
            to: '/employee',
            icon: <PeopleIcon/>,
            title: 'Employee',
            auth: true,
            visible: true
        },
        {
            to: '/meetings',
            icon: <MeetingRoomIcon/>,
            title: 'Meetings',
            auth: true,
            visible: true
        },
        {
            to: '/device',
            icon: <ComputerIcon/>,
            title: 'Device',
            auth: true,
            visible: true
        },
        {
            to: '/creditcard',
            icon: <CreditCardIcon/>,
            title: 'CreditCard',
            auth: true,
            visible: true
        }
    ],
    Community : [
        {
            to: '/approvalhistory',
            icon: <AssignmentTurnedInIcon/>,
            title: 'ApprovalHistory',
            auth: true,
            visible: true
        },
        {
            to: '/board',
            icon: <NoteAltIcon/>,
            title: 'Board',
            auth: true,
            visible: true
        },        
    ],
    Admin : [
        {
            to: '/summary',
            icon: <SummarizeIcon/>,
            title: 'Summary',
            auth: false,
            visible: true
        },
        {
            to: '/location',
            icon: <PlaceIcon/>,
            title: 'Location',
            auth: false,
            visible: true
        },
        {
            to: '/loginhistory',
            icon: <BookIcon/>,
            title: 'LoginHistory',
            auth: false,
            visible: true
        },
    ]
}

const SidebarItems = ({itemList, titleIndex}) => {
    const user = getUser()
    return (
        itemList.map((item, itemIndex) => (
            <Link 
                to={item.to} 
                style={{ textDecoration: 'none' }}
                key={itemIndex}
            >
                {(item.auth || user.isAdmin) &&
                    <Item className={item.visible ? '' : 'invisible'}>
                        <Icon
                            ref={(el) => {
                                if (el && window.innerWidth<600) {
                                    tippy(el, { content: item.title, placement: 'bottom' });
                                }
                            }}
                        >
                            {item.icon}    
                        </Icon>
                        <Span>{item.title}</Span>
                    </Item>
                }
            </Link>
        ))
    )
}

const SidebarCategories = () => {
    return (
        Object.keys(itemDict).map((title, titleIndex) => (
            <div
                key={titleIndex}
            >
                <Title>{title}</Title>
                <SidebarItems
                    itemList = {itemDict[title]}
                    titleIndex = {titleIndex}
                />
            </div>
        )) 
    ) 
}

const Sidebar = ({menu, setMenu}) => {
    const user = getUser()
    const handleMenu = () => {
        user.isLogin&&setMenu(!menu)
    }
    return (
        <Wrapper>
            <Top>
                <img
                    src='/smartwork.webp'  
                    alt='SmartWork Logo'
                    style={{ height: 50 }}
                    onClick={handleMenu}       
                />
                <Logo>SmartWork</Logo>
            </Top>
            <Middle>
                <Items>
                    <SidebarCategories/>
                </Items>
            </Middle>
            <Bottom>
                <FootMessage>
                    Copyright © {(new Date().getFullYear())} SmartWork. 
                </FootMessage>
            </Bottom>
        </Wrapper>
    )
}

export default Sidebar