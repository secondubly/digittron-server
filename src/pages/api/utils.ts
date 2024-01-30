import type { APIContext } from "astro"

type OauthResult = {
    stateType: string,
    success: boolean,
    error: string | null
}

export const verifyOauth = async (context: APIContext, type: string, state: string | null, code: string | null, error: string | null, storedState?: string): Promise<Response | null> => {
    if (error) {
        // user probably denied request
        context.cookies.set('oauth_result', await jsonifyOauthCookie(type, false, error), {
            httpOnly: false,
            secure: !import.meta.env.DEV,
            path: "/",
            maxAge: 60 * 60 // 1 hour
        })
        return context.redirect('/setup', 302)
    } else if (!storedState || !state || storedState !== state || !code) {
        // invalid payload
        return new Response(null, {
            status: 400
        })
    }

    return null
}

export const jsonifyOauthCookie = (type: string, success: boolean, error: string| null): string => {
    const oauthResult: OauthResult = {
        stateType: type,
        success: success,
        error: error
    }
    return JSON.stringify(oauthResult)
}

export const refreshOauth = async (refreshToken: string): Promise<string> => {
    const url = 'https://id.twitch.tv/oauth2/token?'
        + `client_id=${process.env.PUBLIC_TWITCH_CLIENT_ID}`
        + `&client_secret=${process.env.TWITCH_CLIENT_SECRET}`
        + '&grant_type=refresh_token&'
        + `refresh_token=${encodeURIComponent(refreshToken)}`

    console.debug(url)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    if (!response.ok) {
        throw Error('Invalid Response ' + response.statusText)
    }

    const result = await response.json()
    return result.access_token
}