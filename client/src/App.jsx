import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './style.scss'
import Attend from './pages/Attend'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import LostPassword from './pages/auth/LostPassword'
import ResetPasswordWithOtp from './pages/auth/ResetPasswordWithOtp'
import Callback from './pages/auth/Callback'
import Wifi from './pages/Wifi'
import GPS from './pages/GPS'
import Location from './pages/Location'
import Dashboard from './pages/Dashboard'
import Summary from './pages/Summary'
import Device from './pages/Device'
import CreditCard from './pages/CreditCard'
import Employee from './pages/Employee'
import MeetingRoom from './pages/MeetingRoom'
import LoginHistory from './pages/LoginHistory'
import ApprovalHistory from './pages/ApprovalHistory'
import TooManyRequests from './pages/TooManyRequests'
import NotFound from './pages/NotFound'
import { LoadingSpinner } from './utils/GeneralUtil'
import { getUser } from './storage/userSlice'
import { useResponsive } from './hooks/useResponsive'

const Map = lazy(() => import('./pages/Map'))
const Board = lazy(() => import('./pages/Board'))
const CheckEmail = lazy(() => import('./pages/CheckEmail'))

function App() { 
    const user = getUser()
    const { isMobile } = useResponsive()
    const [menu, setMenu] = useState(isMobile?false:true)
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner/>}>
                <Routes>
                    <Route exact path='/' element={user.isLogin ? <Navigate to='/dashboard'/> : <Navigate to='/auth/login'/>}/>
                    <Route exact path='/auth/register' element={<Register menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/login' element={<Login menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/reset-password' element={<ResetPassword menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/lost-password' element={<LostPassword menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/reset-password-with-otp' element={<ResetPasswordWithOtp menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/auth/callback' element={<Callback menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/map' element={<Map menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/dashboard' element={<Dashboard menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/attend' element={<Attend menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/wifi-attend' element={<Wifi menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/gps-attend' element={<GPS menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/summary' element={<Summary menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/location' element={<Location menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/device' element={<Device menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/creditcard' element={<CreditCard menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/employee' element={<Employee menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/meetings' element={<MeetingRoom menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/loginhistory' element={<LoginHistory menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/approvalhistory' element={<ApprovalHistory menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/board' element={<Board menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/check-email' element={<CheckEmail menu={menu} setMenu={setMenu}/>}/>
                    <Route exact path='/too-many-requests' element={<TooManyRequests/>}/>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
