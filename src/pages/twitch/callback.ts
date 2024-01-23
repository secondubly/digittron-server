import type { APIRoute } from 'astro'
import { redis } from '../../middleware'

export const get: APIRoute = async (context) => {
    const storedState = context.cookies.get('twitch_oauth_state')?.value
    const state = context.url.searchParams.get('state')
    const code = context.url.searchParams.get('code')

    if (!storedState || !state || storedState !== state || !code) {
        return new Response(null, {
            status: 400
        })
    }

    const redirect_uri = context.url.origin + '/twitch/callback'
    try {
        const { token: auth, refresh } = await getTwitchAuthToken(redirect_uri, code)
        await redis.set('twitch_access_token', auth)
        await redis.set('twitch_refresh_token', refresh)
        context.locals.setup = { stateType: 'twitch', success: true }
        return context.redirect('/setup', 302)
    } catch (e) {
        if (e instanceof Error) {
            console.error('There was an error when retrieving the Twitch authorization code', e.cause)
            return new Response(null, {
                status: 400
            })
        } else {
            // Some other error probably
            context.locals.setup = { stateType: 'twitch', success: false }
            return context.redirect('/setup', 302)
        }

    }
}

async function getTwitchAuthToken(redirect: string, code: string): Promise<{token: string, refresh: string}> {
	let url = 'https://id.twitch.tv/oauth2/token'
	const headers = new Headers()
	headers.set('Content-Type', 'application/x-www-form-urlencoded')

	const response = await fetch(url, {
		method: 'POST',
		headers: headers,
		body: new URLSearchParams({
            'client_id': process.env.PUBLIC_TWITCH_CLIENT_ID!,
            'client_secret': process.env.TWITCH_CLIENT_SECRET!,
            'code': code,
			'grant_type': 'authorization_code',
			'redirect_uri': redirect,
		})
	})

	if (response.ok) {
		const jsonResponse = await response.json()
		redis.set('spotify_access_token', jsonResponse.access_token)
		redis.set('spotify_refresh_token', jsonResponse.refresh_token)
        return { token: jsonResponse.access_token, refresh: jsonResponse.refresh_token }
	} else {
        throw new Error('Invalid response received.', { cause: await response.json() })
	}
}