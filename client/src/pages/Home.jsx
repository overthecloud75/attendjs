import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Advertisement from '../components/Advertisement'
import Feature from '../components/Feature'
import Footer from '../components/Footer'
import GMap from '../components/GoogleMap'

const Home = ({menu, setMenu}) => {

    const { state } = useLocation()

    return (
        <div className='container'>
            {menu && <Sidebar/> }
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                {state ? 
                    <GMap
                       state={state}
                    />:
                    <>
                        <Advertisement/>
                        <Feature/>
                    </>
                }
                {menu && <Footer/>}
            </div>
        </div>
    )
}

export default Home