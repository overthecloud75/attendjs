import distance from 'gps-distance'
import CryptoJS from 'crypto-js'
import { MOBILE_IP_LIST } from '../config/working.js'
import Location from '../models/Location.js'
import GPSOn from '../models/GPSOn.js'

export default class LocationService {

    constructor() {
    }

    static checkMobile(ip, user_agent) {
        const ip16 = ip.split('.').slice(0, 2).join('.')
        const isMobile = MOBILE_IP_LIST.includes(ip16) && (user_agent.includes('iPhone') || user_agent.includes('Android')) ? 'O' : 'X'
        const isRemotePlace = ip16 === process.env.REMOTE_IP
        return { isMobile, isRemotePlace }
    }

    static attendRemotePlace(isRemotePlace, isMobile, cloudflareCheck, loginType) {
        let attend = false
        let place = ''
        let minDistance = 10000
        let placeLocation = { latitude: -1, longitude: -1 }
        if (isRemotePlace && (cloudflareCheck === 'O' || loginType === 'sso')) {
            attend = true
            place = process.env.REMOTE_PLACE
            minDistance = 0
        }
        return { attend, place, minDistance, placeLocation, isMobile }
    }

    static async whereIs(location, isMobile) {
        let attend = false
        let place = ''
        let distanceResult = 0
        let minDistance = 10000
        let placeLocation = { latitude: -1, longitude: -1 }
        if (location) {
            const locations = await Location.find()
            for (let loc of locations) {
                distanceResult = Math.round(distance(loc.latitude, loc.longitude, location.latitude, location.longitude) * 1000) / 1000
                if (distanceResult < minDistance) {
                    place = loc.location
                    minDistance = distanceResult
                    placeLocation = { latitude: loc.latitude, longitude: loc.longitude }
                    if (distanceResult < loc.dev) {
                        attend = true
                    }
                }
            }
        }
        return { attend, place, minDistance, placeLocation, isMobile }
    }

    static decryptLocation(lastLogin, hashLocation) {
        const bytes = CryptoJS.AES.decrypt(hashLocation, lastLogin.hash.toString())
        const location = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return location
    }

    static async setGpsOn(employeeId, name, date, time, where) {
        if (where.attend) {
            const gpsOn = await GPSOn.findOne({ date, employeeId })
            if (gpsOn) {
                await GPSOn.updateOne({ date, employeeId, name }, { $set: { end: time, endPlace: where.place } }, { runValidators: true })
            } else {
                const newGPSOn = new GPSOn({ employeeId, name, date, begin: time, beginPlace: where.place, end: time, endPlace: where.place })
                await newGPSOn.save()
            }
        }
    }
}
