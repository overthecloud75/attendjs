import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import Calendar from '../components/Calendar'
import Footer from '../components/Footer'

const Schedule = ({menu, setMenu}) => {
    return (
        <div className='container'>
            {menu && <Sidebar/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <Calendar/>
                {menu && <Footer/>}
            </div>
        </div>
    )
}

export default Schedule