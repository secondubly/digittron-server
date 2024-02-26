import type { APIRoute } from 'astro'
import { redis } from '../../middleware'
import { getUserData, jsonifyOauthCookie, verifyOauth } from '../api/utils'
import { exchangeCode } from '@twurple/auth'


export const GET: APIRoute = async (context) => {
    const storedState = context.cookies.get('broadcaster-state')?.value
    const state = context.url.searchParams.get('state')
    const code = context.url.searchParams.get('code')
    const error = context.url.searchParams.get('error')

    const response = await verifyOauth(context, 'twitch', state, code, error, storedState)
    if (response) {
        return response
    }

    try {
        const redirect_uri = context.url.origin + '/twitch/callback'
        
        const tokenData = await exchangeCode(process.env.PUBLIC_TWITCH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET! , code!, redirect_uri)
        
        // get account id
        const user = await getUserData(tokenData.accessToken)
        if (!user) {
            // TODO: error handling
            console.error('something went wrong')
        }
        await redis.set(user!.id, JSON.stringify(tokenData))

        context.cookies.set('oauth_result', jsonifyOauthCookie('twitch_broadcaster', true, error), {
            httpOnly: false,
            secure: !import.meta.env.DEV,
            path: "/",
            maxAge: 60 * 60 // 1 hour
        })
        
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
