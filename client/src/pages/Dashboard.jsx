import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'
import DashboardContainer from '../components/dashboard/DashboardContainer'
import { ChatWidget } from '../components/dashboard/ChatWidget'

const Dashboard = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <DashboardContainer />
            </div>
            <ChatWidget/>
        </div>
    )
}

export default Dashboard