import MainLayout from '../components/layout/MainLayout'
import DashboardContainer from '../components/dashboard/DashboardContainer'
import { ChatWidget } from '../components/dashboard/ChatWidget'

const Dashboard = ({ menu, setMenu }) => {
    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <DashboardContainer />
            <ChatWidget />
        </MainLayout>
    )
}

export default Dashboard