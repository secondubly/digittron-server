import type { APIRoute } from "astro"
import { redis } from "../../middleware"
import { getUserData, verifyOauth } from "../api/utils"
import { exchangeCode } from "@twurple/auth"
import type { GetUsersResponse } from "ts-twitch-api"

export const GET: APIRoute = async (context) => {
    const storedState = context.cookies.get('bot-state')?.value
    const state = context.url.searchParams.get('state')
    const code = context.url.searchParams.get('code')
    const error = context.url.searchParams.get('error')

    const response = await verifyOauth(context, 'twitch', state, code, error, storedState)
    if (response) {
        return response
    }

    try {
        // get app access token as well if we don't have it
        let app_access_token = await redis.get('app_access_token')
        if (!app_access_token) {
            const response = await fetch('https://id.twitch.tv/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'client_id': process.env.PUBLIC_TWITCH_CLIENT_ID ?? '',
                    'client_secret': process.env.CLIENT_SECRET ?? '',
                    'grant_type': 'client_credentials'
                })
            })

            if (response.ok) {
                const json = await response.json()
                await redis.set('app_access_token', json.access_token)
                app_access_token = json.access_token
            }
        }
        const redirect_uri = context.url.origin + '/twitch/bot-callback'
        // get oauth token using twurple
        const tokenData = await exchangeCode(process.env.PUBLIC_TWITCH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET! , code!, redirect_uri)
        // get bot account id
        const user = await getUserData(tokenData.accessToken)
        if (!user) {
            // TODO: error handling
            console.error('something went wrong')
        }
        await redis.set(user!.id, JSON.stringify(tokenData))
        await redis.set('twitch_bot_id', user!.id)
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