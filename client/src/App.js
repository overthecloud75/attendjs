import { useState, Suspense, lazy } from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'
import './style.scss'
import Attend from './pages/Attend'
import Register from './pages/Register'
import Login from './pages/Login'
import Wifi from './pages/Wifi'
import GPS from './pages/GPS'
import Location from './pages/Location'
import Summary from './pages/Summary'
import Device from './pages/Device'
import Schedule from './pages/Schedule'
import Employee from './pages/Employee'
import LoginHistory from './pages/LoginHistory'
import CheckEmail from './pages/CheckEmail'
import Confirm from './pages/Confirm'
import TooManyRequests from './pages/TooManyRequests'
import NotFound from './pages/NotFound'

const Home = lazy(() => import('./pages/Home'))
const Board = lazy(() => import('./pages/Board'))
const Report = lazy(() => import('./pages/Report'))

function App() { 
    const [menu, setMenu] = useState(false)
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route exact path='/' element={<Home menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/register' element={<Register menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/login' element={<Login menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/attend' element={<Attend menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/wifi-attend' element={<Wifi menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/gps-attend' element={<GPS menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/summary' element={<Summary menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/schedule' element={<Schedule menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/location' element={<Location menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/device' element={<Device menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/employee' element={<Employee menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/loginhistory' element={<LoginHistory menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/board' element={<Board menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/report' element={<Report menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/check-email' element={<CheckEmail menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/confirm/:confirmationCode' element={<Confirm menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/too-many-requests' element={<TooManyRequests/>}/>
                    <Route path='*' element={<NotFound/>} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App;
