import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Advertisement from '../components/Advertisement'
import Feature from '../components/Feature'
import Footer from '../components/Footer'
//import GMap from '../components/GoogleMap'
import NMap from '../components/NaverMap'

const Home = ({menu, setMenu}) => {

    const { state } = useLocation()

    return (
        <div className='container'>
            {menu && <Sidebar/> }
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <div className='wrap'>
                    {state ? 
                        <NMap state={state}/>
                        :
                        <>
                            <Advertisement/>
                            <Feature/>
                        </>
                    }
                </div>
                {menu && <Footer/>}
            </div>
        </div>
    )
}

export default Home