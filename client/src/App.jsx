import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.scss'
import Attend from './pages/Attend'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import LostPassword from './pages/auth/LostPassword'
import ResetPasswordWithOtp from './pages/auth/ResetPasswordWithOtp'
import Wifi from './pages/Wifi'
import GPS from './pages/GPS'
import Location from './pages/Location'
import Summary from './pages/Summary'
import Device from './pages/Device'
import CreditCard from './pages/CreditCard'
import Employee from './pages/Employee'
import LoginHistory from './pages/LoginHistory'
import ApprovalHistory from './pages/ApprovalHistory'
import TooManyRequests from './pages/TooManyRequests'
import NotFound from './pages/NotFound'
import { LoadingSpinner } from './utils/GeneralUtil'

const Home = lazy(() => import('./pages/Home'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Board = lazy(() => import('./pages/Board'))
const CheckEmail = lazy(() => import('./pages/CheckEmail'))
const Confirm = lazy(() => import('./pages/Confirm'))

function App() { 
    const [menu, setMenu] = useState(false)
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner/>}>
                <Routes>
                    <Route exact path='/' element={<Home menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/register' element={<Register menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/login' element={<Login menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/reset-password' element={<ResetPassword menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/lost-password' element={<LostPassword menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/reset-password-with-otp' element={<ResetPasswordWithOtp menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/attend' element={<Attend menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/wifi-attend' element={<Wifi menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/gps-attend' element={<GPS menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/summary' element={<Summary menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/schedule' element={<Schedule menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/location' element={<Location menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/device' element={<Device menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/creditcard' element={<CreditCard menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/employee' element={<Employee menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/loginhistory' element={<LoginHistory menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/approvalhistory' element={<ApprovalHistory menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/board' element={<Board menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/check-email' element={<CheckEmail menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/confirm/:confirmationCode' element={<Confirm menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/too-many-requests' element={<TooManyRequests/>}/>
                    <Route path='*' element={<NotFound/>} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
