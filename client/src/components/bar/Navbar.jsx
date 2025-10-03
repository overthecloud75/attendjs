import { useState } from 'react'
import styled from 'styled-components'
import MenuIcon from '@mui/icons-material/Menu'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Avatar, Badge } from '@mui/material'
import { getUser } from '../../storage/userSlice'
import ProfileMenu from '../bar/ProfileMenu'

const Container = styled.div`
    height: 70px;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    top: 0;
    backdrop-filter: blur(10px);
    @media screen and (max-width: 600px) {
        height: 50px;
    }
`
const Wrapper = styled.div`
    width: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`

const MenuButton = styled.div`
    display: ${props => props.visible == 'true' ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
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

    &:hover {
        background-color: rgba(0,0,0,0.04);
    }
`

const StyledBadge = styled(Badge)`
    .MuiBadge-badge {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        font-size: 10px;
        font-weight: 600;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 1px solid #e1e5e9;

    &:hover {
        background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    @media screen and (max-width: 768px) {
        display: none;
    }
`

const UserName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.2;
`

const UserRole = styled.span`
    font-size: 12px;
    color: #64748b;
    line-height: 1.2;
`

const StyledAvatar = styled(Avatar)`
    width: 36px !important;
    height: 36px !important;
    border: 2px solid #e1e5e9;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: #667eea;
        transform: scale(1.05);
    }
`

const Navbar = ({menu, setMenu}) => {

    const user = getUser()
    const [anchorEl, setAnchorEl] = useState(null)
    const handleMenu = () => {
        user.isLogin && setMenu(!menu)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return (
        <Container>
            <Wrapper>
                <LeftSection>
                    <MenuButton 
                        visible={(!menu).toString()} 
                        onClick={handleMenu}
                    >
                        <MenuIcon />
                    </MenuButton>
                </LeftSection>
                <RightSection>
                    <Items>
                        <Item>
                            <StyledBadge badgeContent={2} max={99}>
                                <Icon>
                                    <ChatBubbleOutlineOutlinedIcon />
                                </Icon>
                            </StyledBadge>
                        </Item>
                        
                        <Item>
                            <StyledBadge badgeContent={5} max={99}>
                                <Icon>
                                    <NotificationsIcon />
                                </Icon>
                            </StyledBadge>
                        </Item>
                    </Items>
                    
                    <UserSection onClick={handleClick}>
                        <UserInfo>
                            <UserName>{user.name || '사용자'}</UserName>
                            <UserRole>{user.isAdmin ? '관리자' : '직원'}</UserRole>
                        </UserInfo>
                        <StyledAvatar>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </StyledAvatar>
                    </UserSection>
                </RightSection>
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