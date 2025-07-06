import { Widget } from 'react-chat-widget-react-18'
import 'react-chat-widget-react-18/lib/styles.css'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import Footer from '../components/Footer'
import { useChat } from '../hooks/useChat'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'
import DashboardContainer from '../components/dashboard/DashboardContainer'

const CHAT_CONFIG = {
    title: 'SmartWork Chat',
    subtitle: '',
    showTimeStamp: false
}

const Dashboard = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()
    const { handleNewUserMessage } = useChat()

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <DashboardContainer />
                {menu && <Footer/>}
            </div>
            <Widget
                {...CHAT_CONFIG}
                handleNewUserMessage={handleNewUserMessage}
            />
        </div>
    )
}

export default Dashboard