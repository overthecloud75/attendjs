import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { naverMapAPIKey } from '../configs/apiKey'

const Container = styled.div``

const Title= styled.div`
    display: flex;
    font-weight: bold;
    margin: 10px;
    justify-content: center;
`

const src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=' + naverMapAPIKey

const NMap = ({state}) => {
    const [scriptLoading, setScriptLoading] = useState(true)

    useEffect(() => { 
        let script = document.querySelector(`script[src="${src}"]`)
        if (!script) {
            script = document.createElement('script')
            script.src = src
            script.async = true
            document.head.appendChild(script)
        }
        const handleLoad = () => {
            setScriptLoading(false)
            let map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(state.location.latitude, state.location.longitude),
                zoom: 16
            })
            // eslint-disable-next-line
            const marker1 = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(state.where.placeLocation.latitude, state.where.placeLocation.longitude),
                map: map,
                title: state.where.place
            })
            // eslint-disable-next-line
            const marker2 = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(state.location.latitude, state.location.longitude),
                map: map
            })
        }
        script.addEventListener('load', handleLoad)
        return function cleanup() {
            script.removeEventListener('load', handleLoad)
            script.parentNode.removeChild(script)
        }
        
    // eslint-disable-next-line
    }, [scriptLoading])

    return (  
        <Container>
        {state&&<Title>Your location is {state.where.minDistance * 1000}m distant from {state.where.place}</Title>}
        {state&&state.where.attend?
            <Title>Don't worry. <mark>checked</mark></Title>:
            <Title><mark>Unchecked.</mark> plz login again</Title>
        }
            <div id='map' style={{
                display: scriptLoading ? 'none' : 'block',
                width: '100%', 
                height: '400px'
            }}/>
        </Container>
    )
}

export default NMap