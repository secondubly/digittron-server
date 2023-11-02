import { AstroAuth, type AstroAuthConfig } from "auth-astro"
import Twitch from '@auth/core/providers/twitch'

export const authOpts: AstroAuthConfig = {
    providers: [
        Twitch({
            clientId: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            authorization: { 
                params: 'openid chat:editchat:read+moderator:manage:announcements+moderator:manage:banned_users+moderator:manage:chat_messages+moderator:manage:chat_settings+user:manage:whispers+whispers:read'
            }
        })
    ],
    debug: true
}

export const { get, post } = AstroAuth(authOpts)