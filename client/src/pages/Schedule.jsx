import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Calendar from '../components/Calendar'
import Footer from '../components/Footer'

const Schedule = () => {
    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/>
                <Calendar/>
                <Footer/>
            </div>
        </div>
    )
}

export default Schedule