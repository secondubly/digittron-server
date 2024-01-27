import type { APIContext, APIRoute } from 'astro'
import { redis } from '../../middleware'
import { jsonifyOauthCookie, verifyOauth } from '../api/utils'

export const GET: APIRoute = async (context) => {
    const storedState = context.cookies.get('twitch_oauth_state')?.value
    const state = context.url.searchParams.get('state')
    const code = context.url.searchParams.get('code')
    const error = context.url.searchParams.get('error')

    const response = await verifyOauth(context, 'spotify', state, code, error, storedState)
    if (response) {
        return response
    }

    try {
        const redirect_uri = context.url.origin + '/twitch/callback'
        await getTwitchAuthToken(context, redirect_uri, code!, error)
        return context.redirect('/setup', 302)
    } catch (e) {
        if (e instanceof Error) {
            console.error('There was an error when retrieving the Twitch authorization code', e.cause)
            return new Response(null, {
                status: 400
            })
        } else {
            // Some other error probably
            return context.redirect('/setup', 302)
        }

    }
}

async function getTwitchAuthToken(context: APIContext, redirect: string, code: string, error: string | null): Promise<void> {
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
        context.cookies.set('oauth_result', jsonifyOauthCookie('twitch', true, error), {
            httpOnly: false,
            secure: !import.meta.env.DEV,
            path: "/",
            maxAge: 60 * 60 // 1 hour
        })

		const jsonResponse = await response.json()
		redis.set('twitch_access_token', jsonResponse.access_token)
		redis.set('twitch_refresh_token', jsonResponse.refresh_token)
	} else {
        throw new Error('Invalid response received.', { cause: await response.json() })
	}
}