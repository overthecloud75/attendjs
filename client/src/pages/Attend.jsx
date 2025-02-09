import { Widget } from 'react-chat-widget-react-18'
import 'react-chat-widget-react-18/lib/styles.css'
import { useChat } from '../hooks/useChat'
import { useResponsive } from '../hooks/useResponsive'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import TableWithSearch from '../components/tables/TableWithSearch'
import { columnHeaders, mobileColumnHeaders, csvHeaders } from '../configs/attend'
import Footer from '../components/Footer'

const CHAT_CONFIG = {
    title: 'SmartWork Chat',
    subtitle: '',
    showTimeStamp: false
}

const Attend = ({menu, setMenu}) => {

    const { handleNewUserMessage } = useChat()
    const { isMobile } = useResponsive()

    return (     
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <TableWithSearch 
                    searchKeyword='name'
                    page='attend'
                    url='/api/attend/search'
                    columnHeaders={isMobile ? mobileColumnHeaders : columnHeaders}
                    csvHeaders={csvHeaders}
                />
                {menu && <Footer/>}
            </div>
            <Widget
                {...CHAT_CONFIG}
                handleNewUserMessage={handleNewUserMessage}
            />
        </div>  
    )
}

export default Attend