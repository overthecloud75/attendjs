import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'
import './style.scss'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Attend from './pages/Attend'
import Wifi from './pages/Wifi'
import Location from './pages/Location'
import Summary from './pages/Summary'
import Device from './pages/Device'
import Schedule from './pages/Schedule'
import Employee from './pages/Employee'
import Board from './pages/Board'
import Report from './pages/Report'
import CheckEmail from './pages/CheckEmail'
import Confirm from './pages/Confirm'
import NotFound from './pages/NotFound'

function App() { 
    return (
        <BrowserRouter>   
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='/register' element={<Register/>}/>
                <Route exact path='/login' element={<Login/>}/>
                <Route exact path='/attend' element={<Attend/>}/>
                <Route exact path='/wifi-attend' element={<Wifi/>}/>
                <Route exact path='/summary' element={<Summary/>}/>
                <Route exact path='/schedule' element={<Schedule/>}/>
                <Route exact path='/location' element={<Location/>}/>
                <Route exact path='/device' element={<Device/>}/>
                <Route exact path='/employee' element={<Employee/>}/>
                <Route exact path='/board' element={<Board/>}/>
                <Route exact path='/report' element={<Report/>}/>
                <Route exact path='/check-email' element={<CheckEmail/>}/>
                <Route exact path='/confirm/:confirmationCode' element={<Confirm/>}/>
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
