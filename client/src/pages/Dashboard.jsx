import MainLayout from '../components/layout/MainLayout'
import DashboardContainer from '../components/dashboard/DashboardContainer'

const Dashboard = ({ menu, setMenu }) => {
    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <DashboardContainer />
        </MainLayout>
    )
}

export default Dashboard