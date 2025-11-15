import { useLocation } from 'react-router-dom'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
//import GMap from '../components/GoogleMap'
import NMap from '../components/NaverMap'

const defaultState = {
    location: {
        latitude: 37,
        longitude: 127
    },
    where: {
        minDistance: 100,
        place: 'Unknown',
        placeLocation: {
            latitude: 37.01,
            longitude: 127.01
        },
        attend: false
    }
}

const Map = ({menu, setMenu}) => {

    const { state } = useLocation()

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar 
                    menu={menu} 
                    setMenu={setMenu}
                /> 
                <NMap state={state ?? defaultState}/>    
            </div>
        </div>
    )
}

export default Map