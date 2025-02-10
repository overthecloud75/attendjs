import { useState } from 'react'
import styled from 'styled-components'
import MenuIcon from '@mui/icons-material/Menu'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import { Avatar } from '@mui/material'
import { getUser } from '../../storage/userSlice'
import ProfileMenu from '../bar/ProfileMenu'

const Container = styled.div`
    height: 50px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
    background-color: white;
`
const Wrapper = styled.div`
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Items = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`
const Item = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0,0,0,0.04);
    }
`
const Icon = styled.div`
    font-size: 20px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;   
`
const Counter = styled.div`
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    position: absolute;
    top: -3px;
    right: -3px;
`

const Navbar = ({menu, setMenu}) => {

    const user = getUser()
    const [anchorEl, setAnchorEl] = useState(null)
    const handleMenu = () => {
        user.isLogin&&setMenu(!menu)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return (
        <Container>
            <Wrapper>
                <Icon onClick={handleMenu}>
                    <MenuIcon/>
                </Icon>
                <Items>
                    <Item>
                        <Icon>
                            <FullscreenExitOutlinedIcon/>
                        </Icon>
                    </Item>
                    <Item>
                        <Icon>
                            <NotificationsNoneOutlinedIcon/>
                        </Icon>
                        <Counter>1</Counter>
                    </Item>
                    <Item>
                        <Icon> 
                            <ChatBubbleOutlineOutlinedIcon/>
                        </Icon>
                        <Counter>2</Counter>
                    </Item>
                    <Item>
                        <Icon>
                            <ListOutlinedIcon/>
                        </Icon>
                    </Item>
                    <Item onClick={handleClick}>
                        <Avatar/>
                    </Item>
                </Items>
            </Wrapper>
            <ProfileMenu 
                user={user}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setMenu={setMenu}
            />     
        </Container>
    )
}

export default Navbar