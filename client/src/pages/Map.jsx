import { useLocation } from 'react-router-dom'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
//import GMap from '../components/GoogleMap'
import NMap from '../components/NaverMap'

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
                <NMap state={state}/>    
            </div>
        </div>
    )
}

export default Map