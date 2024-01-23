import type { APIRoute } from 'astro'
import { redis } from '../../middleware'

export const GET: APIRoute = async (context) => {
    const storedState = context.cookies.get('spotify_oauth_state')?.value
    const state = context.url.searchParams.get('state')
    const code = context.url.searchParams.get('code')

    console.log("State (Callback Cookie): ", storedState)
    if (!storedState || !state || storedState !== state || !code) {
        return new Response(null, {
            status: 400
        })
    }
    
    try {
        let url = 'https://accounts.spotify.com/api/token'
        const headers = new Headers()
        headers.set('Content-Type', 'application/x-www-form-urlencoded')
        headers.set('Authorization', 'Basic ' + Buffer.from(process.env.PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    
        const redirect_uri = context.url.origin + '/spotify/callback'
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams({
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri
            })
        })
    
        if (response.ok) {
            const jsonResponse = await response.json()
            const result = JSON.stringify({
                stateType: 'spotify',
                success: 'true'
            })
            context.cookies.set('oauth_result', result, {
                httpOnly: false,
                secure: !import.meta.env.DEV,
                path: "/",
                maxAge: 60 * 60 // 1 hour
            })
            redis.set('spotify_access_token', jsonResponse.access_token)
            redis.set('spotify_refresh_token', jsonResponse.refresh_token)
        } else {
            throw new Error('Invalid response received.', { cause: await response.json() })
        }
        
        return context.redirect('/setup', 302)
    } catch (e) {
        if (e instanceof Error) {
            console.error('There was an error when retrieving the Spotify authorization code', e.cause)
            return new Response(null, {
                status: 400
            })
        } else {
            // Some other error probably
            return context.redirect('/setup', 302)
        }

    }
}