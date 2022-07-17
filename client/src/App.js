
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom"
import Attend from "./pages/Attend";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/attend" element={<Attend/>}/>
                <Route exact path="/calendar" element={<Calendar/>}/>
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
