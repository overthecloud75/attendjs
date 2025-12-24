import { useState, useCallback } from 'react'

export const useLocation = () => {
    const [error, setError] = useState('')

    const getLocation = useCallback(() => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
            setError('Geolocation이 지원되지 않습니다.')
            resolve({ location: null, error: 'Geolocation이 지원되지 않습니다.' })
            return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords
                    const location = {
                        latitude,
                        longitude,
                        accuracy,
                        timestamp: position.timestamp
                    }
                    resolve({ location, error: null })
                },
                (err) => {
                    setError(`위치 정보를 가져오는 데 실패했습니다: ${err.message}`)
                    resolve({ location: null, error: err.message })
                },
                { enableHighAccuracy: true, maximumAge: 0 }
                )
            })
        }, [])
    return { getLocation, error }
}