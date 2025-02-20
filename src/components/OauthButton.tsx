import { useState, useCallback, useEffect } from "react";

const TWITCH_OAUTH_KEY = 'twitch-oauth-state'

const generateState = (length: number = 32): string => {
    const buffer = new Uint8Array(length / 2)
    window.crypto.getRandomValues(buffer)
    // convert randomValues array to string
    return Array.from(buffer, dec => ("0" + (dec & 0xFF).toString(16)).slice(-2)).join('')
}

const saveState = (state: string) => {
    sessionStorage.setItem(TWITCH_OAUTH_KEY, state)
}

const removeState = () => {
    sessionStorage.removeItem(TWITCH_OAUTH_KEY)
}


interface OauthProps {
    host: string,
    clientID: string,
    redirectURL: string,
    scope: string[]
}

export const OauthButton = (props: OauthProps) => {
    const {
        host,
        clientID,
        redirectURL,
        scope
    } = props

    const [isAuthed, setIsAuthed] = useState(false)

    const generateOauthURL = (host: string, redirect_url: string, client_id: string, scopes: string[]) => {
        return host
            + '/oauth2/authorize?client_id='
            + client_id + '&'
            + 'force_verify=true&'
            + 'redirect_uri='
            + redirect_url
            + '&response_type=token&'
            + 'scope='
            + encodeURI(scopes.join('+'))
            + '&state='
            + generateState()
    }

    const loadOauth = () => {
        const state = generateState()
        saveState(state)

        const url = generateOauthURL(host, redirectURL, clientID, scope)
        window.location.href = url
    }


    // Check if user successfully authenticated
    useEffect(() => {
        if (document.location.hash) {
            const params = new URLSearchParams(window.location.hash.substring(1))
            if (params.get("state") && params.get("state") === sessionStorage.getItem(TWITCH_OAUTH_KEY) && params.get("access_token")) {
                const accessToken = params.get("access_token")
                console.log("Access Token", accessToken)
                setIsAuthed(true)
            }
        }  else {
            // probably an error, print to console
            const params = new URL(window.location.href).searchParams
            if (!params.get("state") || params.get("state") !== sessionStorage.getItem(TWITCH_OAUTH_KEY)) {
                console.debug("state failed")
                // fail silently
                return
            } 

            const err = params.get("error")
            const err_desc = params.get('error_description')
            console.error("error", err)
            console.error("error description", err_desc)
        }

        // on fail or success, clear state token
        removeState()
    }, [])

    useEffect(() => {
        if (isAuthed) {
          console.log('hello')
        }
      }, []);


    return (
        <button onClick={loadOauth} style={{ backgroundColor: "#9146FF", color: "#fff" }}>
            Sign Into Twitch
        </button>
    )
}

