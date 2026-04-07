import { Outlet } from 'react-router-dom'
import Sidebar from '../bar/Sidebar'
import Navbar from '../bar/Navbar'

const MainLayout = ({ menu, setMenu }) => {
    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu} />}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu} />
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout
