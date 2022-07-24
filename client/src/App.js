import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom"
import Navbar from "./components/Navbar";
import Attend from "./pages/Attend";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import styled from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Container = styled.div`
    display: flex;
`;

const Left = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: teal;
    width: 10%;
    height: 100%;
    color: white;
`;

const Top = styled.div`
    display: flex;  
    height: 20%; 
    justify-content: center;
    padding: 50px 0px;
`;

const Middle = styled.div`
    height: 70%; 
    display: flex;
    justify-content: center;
`;

// https://stackoverflow.com/questions/18915550/fix-footer-to-bottom-of-page

const Bottom = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 0px;
    margin-bottom: 10px;
`;

const Right = styled.div`
    margin-left: 10%;
    width: 90%
`;

function App() {
    return (
        <BrowserRouter>
            <Container>
                <Left>
                    <Top>
                        <Header/>
                    </Top>
                    <Middle>
                        <Navbar/>
                    </Middle>
                    <Bottom>
                        <Footer/>
                    </Bottom>
                </Left>
                <Right>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/attend" element={<Attend/>}/>
                        <Route exact path="/calendar" element={<Calendar/>}/>
                        <Route path="*" element={<NotFound/>} />
                    </Routes>
                </Right>
            </Container>
        </BrowserRouter>
    );
}

export default App;
