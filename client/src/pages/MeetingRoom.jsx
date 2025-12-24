import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'
import MeetingRoomContainer from '../components/meeting/MeetingRoomContainer'

const MeetingRoom = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <MeetingRoomContainer/>
            </div>
        </div>
    )
}

export default MeetingRoom