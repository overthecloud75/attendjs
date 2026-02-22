import { useState, Suspense, lazy, useEffect } from 'react'
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
import { useSelector } from 'react-redux'
import { useResponsive } from './hooks/useResponsive'
import ProtectedRoute from './components/auth/ProtectedRoute'

const Map = lazy(() => import('./pages/Map'))
const BoardListPage = lazy(() => import('./pages/board/BoardListPage'))
const BoardWritePage = lazy(() => import('./pages/board/BoardWritePage'))
const BoardDetailPage = lazy(() => import('./pages/board/BoardDetailPage'))
const CheckEmail = lazy(() => import('./pages/CheckEmail'))
// Admin Settings Imports
const SettingsLayout = lazy(() => import('./pages/admin/SettingsLayout'))
const GeneralSettings = lazy(() => import('./pages/admin/settings/General'))
const SecuritySettings = lazy(() => import('./pages/admin/settings/Security'))
const NotificationSettings = lazy(() => import('./pages/admin/settings/Notifications'))

function App() {
    const user = useSelector(state => state.user)
    const theme = useSelector(state => state.theme.mode)
    const { isMobile } = useResponsive()
    const [menu, setMenu] = useState(isMobile ? false : true)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route exact path='/' element={user.isLogin ? <Navigate to='/dashboard' /> : <Navigate to='/auth/login' />} />
                    <Route exact path='/auth/register' element={<Register menu={menu} setMenu={setMenu} />} />
                    <Route exact path='/auth/login' element={<Login menu={menu} setMenu={setMenu} />} />
                    <Route exact path='/auth/reset-password' element={<ResetPassword menu={menu} setMenu={setMenu} />} />
                    <Route exact path='/auth/lost-password' element={<LostPassword menu={menu} setMenu={setMenu} />} />
                    <Route exact path='/auth/reset-password-with-otp' element={<ResetPasswordWithOtp menu={menu} setMenu={setMenu} />} />
                    <Route exact path='/auth/callback' element={<Callback menu={menu} setMenu={setMenu} />} />

                    {/* Protected Routes */}
                    <Route exact path='/map' element={<ProtectedRoute><Map menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/dashboard' element={<ProtectedRoute><Dashboard menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/attend' element={<ProtectedRoute><Attend menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/wifi-attend' element={<ProtectedRoute><Wifi menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/gps-attend' element={<ProtectedRoute><GPS menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/summary' element={<ProtectedRoute><Summary menu={menu} setMenu={setMenu} /></ProtectedRoute>} />

                    {/* Admin Settings Routes */}
                    <Route path='/admin/settings' element={<ProtectedRoute><SettingsLayout menu={menu} setMenu={setMenu} /></ProtectedRoute>}>
                        <Route index element={<Navigate to='/admin/settings/location' replace />} />
                        <Route path='location' element={<Location />} />
                        <Route path='general' element={<GeneralSettings />} />
                        <Route path='security' element={<SecuritySettings />} />
                        <Route path='notifications' element={<NotificationSettings />} />
                    </Route>

                    {/* Retro-compatibility or Access control */}
                    <Route exact path='/location' element={<ProtectedRoute><Navigate to='/admin/settings/location' replace /></ProtectedRoute>} />

                    <Route exact path='/device' element={<ProtectedRoute><Device menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/creditcard' element={<ProtectedRoute><CreditCard menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/employee' element={<ProtectedRoute><Employee menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/meetings' element={<ProtectedRoute><MeetingRoom menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/loginhistory' element={<ProtectedRoute><LoginHistory menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/approvalhistory' element={<ProtectedRoute><ApprovalHistory menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/board' element={<ProtectedRoute><BoardListPage menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/board/write' element={<ProtectedRoute><BoardWritePage menu={menu} setMenu={setMenu} /></ProtectedRoute>} />
                    <Route exact path='/board/:id' element={<ProtectedRoute><BoardDetailPage menu={menu} setMenu={setMenu} /></ProtectedRoute>} />

                    <Route exact path='/check-email' element={<CheckEmail menu={menu} setMenu={setMenu} />} />
                    <Route exact path='/too-many-requests' element={<TooManyRequests />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}


export default App
