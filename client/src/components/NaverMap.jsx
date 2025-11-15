import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { naverMapAPIKey } from '../configs/apiKey'

const Title = ({ children }) => (
    <Typography 
        sx={{
            display: 'flex',
            justifyContent: 'center',
            fontWeight: 'bold',
            margin: '10px'
        }}
    >
        {children}
    </Typography>
)

const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapAPIKey}`

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
        <Box>
            {state && (
                <Title>
                    You are {state.where.minDistance * 1000}m away from&nbsp;
                    <strong>{state.where.place}</strong>.
                </Title>
            )}

            {state && (
                <Title>
                    {state.where.attend ? (
                        <>
                            You're all set.&nbsp;<mark>Checked</mark>
                        </>
                    ) : (
                        <>
                            <mark>Unchecked</mark>&nbsp;Please log in again.
                        </>
                    )}
                </Title>
            )}

            <Box
                id='map'
                sx={{
                    display: scriptLoading ? 'none' : 'block',
                    width: '100%',
                    height: '400px'
                }}
            />
        </Box>
    )
}

export default NMap