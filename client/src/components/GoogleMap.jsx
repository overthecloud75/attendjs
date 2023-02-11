import styled from 'styled-components'
import GoogleMapReact from 'google-map-react'
import { googleMapAPIKey } from '../configs/apiKey'

const Container = styled.div`
`

const Title= styled.div`
    display: flex;
    font-weight: bold;
    margin: 10px;
    justify-content: center;
`

const Wrapper = styled.div`
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
const Place = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    background-color: red;
    border: 2px solid #fff;
    border-radius: 100%;
    user-select: none;
    transform: translate(-50%, -50%);
    cursor: pointer;
    &:hover {
      z-index: 1;
    }
`

const GMap = ({state}) => {
    return (
        <Container>
            <Title>Your location is {state.where.minDistance * 1000}m distant from {state.where.place}</Title>
            {state.where.attend?
                (<Title>Don't worry. you are checked</Title>):
                (<Title>Unchecked. plz login again in a right place</Title>)
            }
            {state.where.isMobile ==='O' && state.where.minDistance < 0.5 &&
            <Wrapper>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: googleMapAPIKey }}
                    defaultCenter={{lat: state.location.latitude, lng: state.location.longitude}}
                    defaultZoom={16}
                >
                    <Marker
                        lat={state.location.latitude}
                        lng={state.location.longitude}
                        title='Your Location'
                    />
                    <Place
                        lat={state.where.placeLocation.latitude}
                        lng={state.where.placeLocation.longitude}
                        title={state.where.place}
                    />
                </GoogleMapReact>
            </Wrapper>
            }
        </Container>
    )
}

export default GMap