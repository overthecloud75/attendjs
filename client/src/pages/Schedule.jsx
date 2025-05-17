import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import Calendar from '../components/Calendar'
import Footer from '../components/Footer'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const Schedule = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()

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