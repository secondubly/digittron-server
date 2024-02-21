import type { APIRoute } from "astro"
import { redis } from "../../middleware"
import { verifyOauth } from "../api/utils"
import { exchangeCode } from "@twurple/auth"

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
        const redirect_uri = context.url.origin + '/twitch/bot-callback'
        const tokenData = await exchangeCode(process.env.PUBLIC_TWITCH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET! , code!, redirect_uri)
        redis.set('twitch_bot_token', JSON.stringify(tokenData))
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