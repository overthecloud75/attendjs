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
                    현재 위치는&nbsp;<strong>{state.where.place}</strong>에서&nbsp;
                    {state.where.minDistance * 1000}m 떨어져 있습니다.
                </Title>
            )}

            {state && (
                <Title>
                    {state.where.attend ? (
                        <>
                            확인되었습니다.&nbsp;<mark>출근 완료</mark>
                        </>
                    ) : (
                        <>
                            <mark>출근 미완료</mark>&nbsp;다시 로그인해주세요.
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