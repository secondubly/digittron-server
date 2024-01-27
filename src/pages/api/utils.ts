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