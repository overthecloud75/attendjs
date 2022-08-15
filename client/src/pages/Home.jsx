import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Advertisement from '../components/Advertisement'
import Feature from '../components/Feature'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/> 
                <Advertisement/>
                <Feature/>
                <Footer/>
            </div>
        </div>
    )
}

export default Home