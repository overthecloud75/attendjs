import { useState, Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useResponsive } from './hooks/useResponsive'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MainLayout from './components/layout/MainLayout.jsx'
import { LoadingSpinner } from './utils/GeneralUtil'

// Pages
import Registration from './pages/auth/Register'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import LostPassword from './pages/auth/LostPassword'
import ResetPasswordWithOtp from './pages/auth/ResetPasswordWithOtp'
import Callback from './pages/auth/Callback'
import TooManyRequests from './pages/TooManyRequests'
import CheckEmail from './pages/CheckEmail'
import NotFound from './pages/NotFound'

// Lazy Loading
const Map = lazy(() => import('./pages/Map'))
const Location = lazy(() => import('./pages/Location'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Attend = lazy(() => import('./pages/Attend'))
const Wifi = lazy(() => import('./pages/Wifi'))
const GPS = lazy(() => import('./pages/GPS'))
const Summary = lazy(() => import('./pages/Summary'))
const Device = lazy(() => import('./pages/Device'))
const CreditCard = lazy(() => import('./pages/CreditCard'))
const Employee = lazy(() => import('./pages/Employee'))
const MeetingRoom = lazy(() => import('./pages/MeetingRoom'))
const LoginHistory = lazy(() => import('./pages/LoginHistory'))
const ApprovalHistory = lazy(() => import('./pages/ApprovalHistory'))
const AgenticCanvas = lazy(() => import('./pages/AgenticCanvas'))
const BoardListPage = lazy(() => import('./pages/board/BoardListPage'))
const BoardWritePage = lazy(() => import('./pages/board/BoardWritePage'))
const BoardDetailPage = lazy(() => import('./pages/board/BoardDetailPage'))
const SettingsLayout = lazy(() => import('./pages/admin/SettingsLayout'))
const GeneralSettings = lazy(() => import('./pages/admin/settings/General'))
const SecuritySettings = lazy(() => import('./pages/admin/settings/Security'))
const AISettings = lazy(() => import('./pages/admin/settings/AISettings'))
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
                    <Route exact path='/auth/register' element={<Registration />} />
                    <Route exact path='/auth/login' element={<Login />} />
                    <Route exact path='/auth/reset-password' element={<ResetPassword />} />
                    <Route exact path='/auth/lost-password' element={<LostPassword />} />
                    <Route exact path='/auth/reset-password-with-otp' element={<ResetPasswordWithOtp />} />
                    <Route exact path='/auth/callback' element={<Callback />} />
                    <Route exact path='/check-email' element={<CheckEmail />} />
                    <Route exact path='/too-many-requests' element={<TooManyRequests />} />

                    {/* Shared Service Layout Cluster */}
                    <Route element={<ProtectedRoute><MainLayout menu={menu} setMenu={setMenu} /></ProtectedRoute>}>
                        <Route path='/map' element={<Map />} />
                        <Route path='/agentic-canvas' element={<AgenticCanvas />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/attend' element={<Attend />} />
                        <Route path='/wifi' element={<Wifi />} />
                        <Route path='/gps' element={<GPS />} />
                        <Route path='/summary' element={<Summary />} />
                        <Route path='/device' element={<Device />} />
                        <Route path='/creditcard' element={<CreditCard />} />
                        <Route path='/employee' element={<Employee />} />
                        <Route path='/meetings' element={<MeetingRoom />} />
                        <Route path='/loginhistory' element={<LoginHistory />} />
                        <Route path='/approvalhistory' element={<ApprovalHistory />} />
                        <Route path='/board' element={<BoardListPage />} />
                        <Route path='/board/write' element={<BoardWritePage />} />
                        <Route path='/board/:id' element={<BoardDetailPage />} />
                        
                        <Route path='/admin/settings' element={<SettingsLayout />}>
                            <Route index element={<Navigate to='/admin/settings/general' replace />} />
                            <Route path='location' element={<Location />} />
                            <Route path='general' element={<GeneralSettings />} />
                            <Route path='ai' element={<AISettings />} />
                            <Route path='security' element={<SecuritySettings />} />
                            <Route path='notifications' element={<NotificationSettings />} />
                        </Route>
                    </Route>

                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
