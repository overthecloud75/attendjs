import { useState } from 'react'
import styled from "styled-components"
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar';

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

const Navbar = () => {

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (e) => {setAnchorEl(e.currentTarget)}
    const handleClose = () => {setAnchorEl(null)}

    return (
        <Container>
            <Wrapper>
                <div>
                </div>
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
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </Container>
  )
}

export default Navbar