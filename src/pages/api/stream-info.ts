import type { APIRoute } from "astro";
import { redis } from "../../middleware";
import { getUserData } from "./utils";

// TODO: setup method-override library, change POST to PATCH
export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData()
    const gameID = formData.get('game-id') as string
    const streamTitle = formData.get('title') as string

    if (!gameID && !streamTitle) {
        return new Response(JSON.stringify({
            message: 'Invalid Request'
        }), { status: 400 })        
    }
    let broadcasterID: string | null = await redis.get('twitch_broadcaster_id') ?? null
    let twitchToken = await redis.get('twitch_access_token') ?? null
    if (!twitchToken) {
        return new Response(JSON.stringify({
            message: 'No Twitch Oauth Token, please reauthenticate.'
        }), { status: 400 })
    }

    if (!broadcasterID) {
        const userData = await getUserData(twitchToken)
        if (!userData) {
            return new Response(JSON.stringify({
                message: 'Could not retrieve user data.'
            }), { status: 400 })
        }
        broadcasterID = userData.id
    }

    try {
        const url = `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterID}`
        // TODO: make these some sort of default so I don't have to keep retyping it
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${twitchToken}`)
        headers.append('Client-ID', process.env.PUBLIC_TWITCH_CLIENT_ID!)
        headers.append('Content-Type', 'application/json')
        const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                'game_id': gameID,
                'title': streamTitle
            }).toString()
        })

        if (response.ok) {
            return redirect('/dashboard', 302)
        } else {
            return new Response(JSON.stringify({
                message: response.statusText
            }), { status: response.status })
        }

    } catch (e) {
        throw e
    }
}