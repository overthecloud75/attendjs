import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'
import Attend from './pages/Attend'
import Wifi from './pages/Wifi'
import Summary from './pages/Summary'
import Device from './pages/Device'
import Schedule from './pages/Schedule'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
    return (
        <BrowserRouter>   
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='/attend' element={<Attend/>}/>
                <Route exact path='/wifi-attend' element={<Wifi/>}/>
                <Route exact path='/summary' element={<Summary/>}/>
                <Route exact path='/device' element={<Device/>}/>
                <Route exact path='/schedule' element={<Schedule/>}/>
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
