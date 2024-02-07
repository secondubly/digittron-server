import type { APIContext } from "astro"
import type { Category, ChannelInformation, GetChannelInformationResponse, GetUsersResponse, SearchCategoriesResponse, User } from "ts-twitch-api"
import { redis } from "../../middleware"

type OauthResult = {
    stateType: string,
    success: boolean,
    error: string | null
}

const fetchWithRetries = async (url: string, options: RequestInit, retryCount = 0, maxRetries = 3): Promise<Response> => {
    // split out the maxRetries option from the remaining
    // options (with a default of 3 retries)
    try {
      return await fetch(url, options)
    } catch (error) {
      // if the retryCount has not been exceeded, call again
      if (retryCount < maxRetries) {
        return fetchWithRetries(url, options, retryCount + 1)
      }
      // max retries exceeded
      throw error
    }
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

    const response = await fetchWithRetries(url, {
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

export const getStreamInfo = async (authToken: string, broadcasterID: string): Promise<ChannelInformation|null> => {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${authToken}`)
    headers.append('Client-Id', import.meta.env.PUBLIC_TWITCH_CLIENT_ID)
    const url = `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterID}`
    const response = await fetchWithRetries(url, {
            method: 'GET',
            headers
        })

    const streamData = await response.json()
    if (streamData.data?.length === 0) {
        return null
    } else if (streamData.status === 401) {
        const refreshToken = await redis.get('twitch_refresh_token') ?? null
        if (!refreshToken) {
            throw Error('Oauth Token invalid, anmd no refresh token found.')
        }
        
        const updatedToken = await refreshOauth(refreshToken)
        redis.set('twitch_access_token', updatedToken)
        return getStreamInfo(updatedToken, broadcasterID)
    }

    return (streamData as GetChannelInformationResponse).data[0]
}

export const getUserData = async (authToken: string, username?: string): Promise<User|null> => {
    const headers = new Headers()
    const url = username ? `https://api.twitch.tv/helix/users?login=${username}` : 'https://api.twitch.tv/helix/users'
    let e

    headers.append('Authorization', `Bearer ${authToken}`)
    headers.append('Client-Id', import.meta.env.PUBLIC_TWITCH_CLIENT_ID)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers
        })

        if (!response.ok) {
            // refresh oauth token and try again
            const refreshToken = await redis.get('twitch_refresh_token') ?? null
            if (!refreshToken) {
                throw Error('No refresh token found!')                
            }

            authToken = await refreshOauth(refreshToken)
            redis.set('twitch_access_token', authToken)
        }
        
        const result = await response.json() as GetUsersResponse
        if (result.data.length === 0) {
            return null
        } else {
            return result.data[0] as User
        }
    } catch(err) {
        e = err
    }
    // should never fire
    throw(e)
}

export const getGameSuggestions = async (query: string, first = 20): Promise<Category[]> => {
    const authToken = await redis.get('twitch_access_token')

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${authToken}`)
    headers.append('Client-Id', import.meta.env.PUBLIC_TWITCH_CLIENT_ID)
    const url = encodeURI(`https://api.twitch.tv/helix/search/categories?query=${query}&first=${first}`)
    const response = await fetchWithRetries(url, { method: 'GET'})
    const json = await response.json() as SearchCategoriesResponse

    return json.data
}