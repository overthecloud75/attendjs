import styled from 'styled-components'
import { Tooltip } from 'react-tooltip'
import CloseIcon from '@mui/icons-material/Close'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WifiFindIcon from '@mui/icons-material/WifiFind'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import SummarizeIcon from '@mui/icons-material/Summarize'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlaceIcon from '@mui/icons-material/Place'
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
    border-right: 1px solid #eee;
    min-height: 100vh;
    background-color: white;
`

const Top = styled.div`
    display: flex;  
    height: 50px; 
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid #eee;
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

    @media screen and (max-width: 600px) {
        height: 30px;
        padding: 0px;
        justify-content: center;
    }
` 

const Close = styled.div`
    font-size: 30px;
    color: #7451f8;

    &:hover {
        background-color: rgba(0,0,0,0.04);
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
                to: '/dashboard', 
                icon: <AccountBoxIcon/>,
                title: 'Dashboard',
                auth: true
            },
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
                auth: false
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
        },
        {
            to: '/creditcard',
            icon: <CreditCardIcon/>,
            title: 'CreditCard',
            auth: true
        }
    ],
    Community : [
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
            to: '/loginhistory',
            icon: <BookIcon/>,
            title: 'LoginHistory',
            auth: false
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
                    <Item>
                        <Icon
                            data-tooltip-id={window.innerWidth<600 ? item.title : undefined}
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
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Logo>SmartWork</Logo>
                </Link>
                <Close>
                    <CloseIcon onClick={handleMenu}/>
                </Close>
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