import styled from 'styled-components'
import GoogleMapReact from 'google-map-react'
import { googleMapAPIKey } from '../configs/apiKey'

const Container = styled.div`
    background-color: white;
    display: flex;
    margin: auto;
    justify-content: center;
    height: 70vh;
    width: 90%;
`
const Marker = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    background-color: blue;
    border: 2px solid #fff;
    border-radius: 100%;
    user-select: none;
    transform: translate(-50%, -50%);
    cursor: pointer;
    &:hover {
      z-index: 1;
    }
`

const GMap = ({location}) => {
    return (
        // Important! Always set the container height explicitly
        <Container>
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleMapAPIKey }}
                defaultCenter={{lat: location.latitude, lng: location.longitude}}
                defaultZoom={16}
            >
                <Marker
                    lat={location.latitude}
                    lng={location.longitude}
                    title='Your Location'
                />
            </GoogleMapReact>
        </Container>
    );
}

export default GMap