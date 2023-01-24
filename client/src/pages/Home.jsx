import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Advertisement from '../components/Advertisement'
import Feature from '../components/Feature'
import Footer from '../components/Footer'
import GMap from '../components/GoogleMap'

const Home = () => {

    const { state } = useLocation()

    return (
        <div className='container'>
            <Sidebar/>
            <div className='wrapper'>
                <Navbar/> 
                {state ? 
                    <GMap
                       state={state}
                    />:
                    <>
                        <Advertisement/>
                        <Feature/>
                    </>
                }
                <Footer/>
            </div>
        </div>
    )
}

export default Home