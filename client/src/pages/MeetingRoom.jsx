import MainLayout from '../components/layout/MainLayout'
import MeetingRoomContainer from '../components/meeting/MeetingRoomContainer'

const MeetingRoom = ({ menu, setMenu }) => {
    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <MeetingRoomContainer />
        </MainLayout>
    )
}

export default MeetingRoom