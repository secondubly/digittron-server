import Twitch from "@auth/core/providers/twitch"

export default {
    providers: [
        Twitch({
            clientId: import.meta.env.TWITCH_CLIENT_ID,
            clientSecret: import.meta.env.TWITCH_CLIENT_SECRET
        })
    ],
  }