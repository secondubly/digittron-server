import type { APIRoute } from "astro"
import { redis } from "../../middleware"
import type { SearchCategoriesResponse } from "ts-twitch-api"

export const GET: APIRoute = async ({ request }) => {
    const twitchURL = new URL('https://api.twitch.tv/helix/search/categories')
    const url = new URL(request.url)
    const searchString: string | null = url.searchParams.get('query')
    if (!searchString) {
        return new Response(null, {
            status: 400
        })
    }

    twitchURL.searchParams.append('query', encodeURIComponent(searchString))
    const limitString: string | null = url.searchParams.get('first')
    if (limitString) {
        twitchURL.searchParams.append('first', limitString)
    }

    const authToken = await redis.get('twitch_access_token')
    if (!authToken) {
        return new Response(null, {
            status: 400
        })
    }

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${authToken}`)
    headers.append('Client-Id', import.meta.env.PUBLIC_TWITCH_CLIENT_ID)

    const response = await fetch(twitchURL, {
        method: 'GET',
        headers
    })

    if (!response.ok) {
        return new Response(null, {
            status: 400
        })
    }

    const searchCategories = await response.json() as SearchCategoriesResponse

    return new Response(JSON.stringify(searchCategories), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}