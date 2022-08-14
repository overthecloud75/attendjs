import styled from "styled-components"
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'

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
const Avatar = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
`
const Navbar = () => {
    return (
        <Container>
            <Wrapper>
                <div>
                </div>
                <Items>
                    <Item>
                        <Icon>
                            <LanguageOutlinedIcon/>English
                        </Icon>
                    </Item>
                    <Item>
                        <Icon>
                            <DarkModeOutlinedIcon/>
                        </Icon>
                    </Item>
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
                    <Item>
                        <Avatar
                            src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                        />
                    </Item>
                </Items>
            </Wrapper>
        </Container>
  )
}

export default Navbar