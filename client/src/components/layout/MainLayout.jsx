import Sidebar from '../bar/Sidebar'
import Navbar from '../bar/Navbar'

const MainLayout = ({ children, menu, setMenu }) => {
    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu} />}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu} />
                {children}
            </div>
        </div>
    )
}

export default MainLayout
