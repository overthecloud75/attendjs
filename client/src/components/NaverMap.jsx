import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { MapPin, CheckCircle2, XCircle } from 'lucide-react'
import { naverMapAPIKey } from '../configs/apiKey'

const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapAPIKey}`

const NMap = ({ state }) => {
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
            if (!window.naver) return

            const mapOptions = {
                center: new window.naver.maps.LatLng(state.location.latitude, state.location.longitude),
                zoom: 16,
                zoomControl: true,
                zoomControlOptions: {
                    position: window.naver.maps.Position.TOP_RIGHT
                }
            }

            let map = new window.naver.maps.Map('map', mapOptions)

            // Designated Place Marker (Target)
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(state.where.placeLocation.latitude, state.where.placeLocation.longitude),
                map: map,
                title: state.where.place,
                icon: {
                    content: `
                        <div style="background: #2F2F91; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 5px;">
                            <span>🏢</span> ${state.where.place}
                        </div>
                    `,
                    anchor: new window.naver.maps.Point(20, 20)
                }
            })

            // Current User Location Marker
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(state.location.latitude, state.location.longitude),
                map: map,
                title: '내 위치',
                animation: window.naver.maps.Animation.BOUNCE,
                icon: {
                    content: `
                        <div style="background: #ff5722; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 5px;">
                            <span>📍</span> 내 위치
                        </div>
                    `,
                    anchor: new window.naver.maps.Point(20, 20)
                }
            })
        }

        if (window.naver && window.naver.maps) {
            handleLoad();
        } else {
            script.addEventListener('load', handleLoad)
        }

        return function cleanup() {
            script.removeEventListener('load', handleLoad)
        }

    }, [state])

    return (
        <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', p: 2 }}>
            {state && (
                <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
                    <Stack spacing={2} sx={{ alignItems: "center" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                            <MapPin size={20} color="#2F2F91" />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                위치 인증 결과
                            </Typography>
                        </Box>

                        <Typography variant="body1" align="center" sx={{ color: '#444' }}>
                            지정된 장소 <strong>{state.where.place}</strong>에서 <br />
                            <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                {Math.round(state.where.minDistance * 1000)}m
                            </span> 떨어져 있습니다.
                        </Typography>

                        {state.where.attend ? (
                            <Chip
                                icon={<CheckCircle2 size={18} />}
                                label="출근 완료"
                                color="success"
                                variant="filled"
                                sx={{ px: 2, py: 2.5, fontSize: '1rem', fontWeight: 'bold' }}
                            />
                        ) : (
                            <Stack sx={{ alignItems: "center" }} spacing={1}>
                                <Chip
                                    icon={<XCircle size={18} />}
                                    label="출근 미완료"
                                    color="error"
                                    variant="filled"
                                    sx={{ px: 2, py: 2.5, fontSize: '1rem', fontWeight: 'bold' }}
                                />
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    오차 범위를 벗어났습니다. 다시 시도해주세요.
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            )}

            <Paper
                elevation={4}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    position: 'relative'
                }}
            >
                <Box
                    id='map'
                    sx={{
                        width: '100%',
                        height: '450px',
                        backgroundColor: '#eee' // Placeholder color
                    }}
                />
                {scriptLoading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        zIndex: 10
                    }}>
                        <Typography>지도를 불러오는 중입니다...</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    )
}

export default NMap