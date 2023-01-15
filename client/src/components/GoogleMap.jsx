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

const AnyReactComponent = ({ text }) => <h1>{text}</h1>

const GMap = ({location}) => {
    return (
        // Important! Always set the container height explicitly
        <Container>
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleMapAPIKey }}
                defaultCenter={{lat: location.latitude, lng: location.longitude}}
                defaultZoom={15}
            >
                <AnyReactComponent
                    lat={location.latitude}
                    lng={location.longitude}
                    text='Your Location'
                />
            </GoogleMapReact>
        </Container>
    );
}

export default GMap