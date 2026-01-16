import axios from 'axios'
import { createError } from '../utils/error.js'

export default class InfrastructureService {

    // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
    static async handleCloudflarePost(ip, cloudflareToken) {
        if (!cloudflareToken) return 'X'
        const formData = new FormData()
        formData.append('secret', process.env.CLOUDFLARE_SECRET_KEY)
        formData.append('response', cloudflareToken)
        formData.append('remoteip', ip)

        const result = await fetch(process.env.CLOUDFLARE_URL, {
            body: formData,
            method: 'POST',
        })

        const { success } = await result.json()
        return success ? 'O' : 'X'
    }

    static async ssoLoginWithCode(code, session_state, redirect_uri) {
        try {
            const response = await axios.post(
                `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
                new URLSearchParams({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirect_uri,
                }).toString(),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )
            return response.data.access_token
        } catch (err) {
            throw createError(401, err.message)
        }
    }

    static async getUserInfoFromMS365(accessToken) {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response
    }
}
