import { useState } from 'react'
import styled from 'styled-components'
import MenuIcon from '@mui/icons-material/Menu'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import Avatar from '@mui/material/Avatar'
import ProfileMenu from './ProfileMenu'

const Container = styled.div`
    height: 50px;
    border-bottom: 0.5px solid rgb(231, 228, 228);
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
`
const Wrapper = styled.div`
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Items = styled.div`
    display: flex;
    align-items: center;
`
const Item = styled.div`
    display: flex;
    align-items: center;
    margin-right: 20px;
    position: relative;
`
const Icon = styled.div`
    font-size: 20px;   
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
    top: -5px;
    right: -5px;
`

const Navbar = ({menu, setMenu}) => {

    const [anchorEl, setAnchorEl] = useState(null)
    const handleMenu = () => {
        setMenu(!menu)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return (
        <Container>
            <Wrapper>
                <Icon
                    onClick={handleMenu}
                >
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
                    <Item
                        onClick={handleClick}
                    >
                        <Avatar/>
                    </Item>
                </Items>
            </Wrapper>
            <ProfileMenu 
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
            />     
        </Container>
    )
}

export default Navbar