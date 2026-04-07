import { useLocation } from 'react-router-dom'
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

const Map = () => {
    const { state } = useLocation()

    return (
        <NMap state={state ?? defaultState} />
    )
}

export default Map