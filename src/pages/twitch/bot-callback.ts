import type { APIRoute } from "astro"
import { redis } from "../../middleware"
import { getUserData, isValidToken, refreshOauth, verifyOauth } from "../api/utils"
import { exchangeCode } from "@twurple/auth"

export const GET: APIRoute = async (context) => {
    const storedState = context.cookies.get('bot-state')?.value
    const state = context.url.searchParams.get('state')
    let code = context.url.searchParams.get('code') as string
    const error = context.url.searchParams.get('error')

    const response = await verifyOauth(context, 'twitch', state, code, error, storedState)
    if (response) {
        return response
    }

    try {
        // get app access token as well if we don't have it
        const redirect_uri = context.url.origin + '/twitch/bot-callback'

        // get oauth token using twurple
        const tokenData = await exchangeCode(process.env.PUBLIC_TWITCH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET!, code, redirect_uri)
        // get bot account id
        const user = await getUserData(tokenData)
        if (!user) {
            // TODO: error handling
            console.warn('Couldn\'t fetch bot account information!')
        } else {
            await redis.set(user.id, JSON.stringify(tokenData))
            await redis.set('twitch_bot_id', user.id)
        }
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