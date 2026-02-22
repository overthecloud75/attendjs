import { useLocation } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
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

const Map = ({ menu, setMenu }) => {

    const { state } = useLocation()

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            <NMap state={state ?? defaultState} />
        </MainLayout>
    )
}

export default Map