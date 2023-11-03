import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite'
const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = loadEnv(process.env.NODE_ENV, process.cwd(), "");
import node from "@astrojs/node"
import auth from 'auth-astro'
import TwitchProvider from "@auth/core/providers/twitch"
import { env } from 'process';

const twitch = TwitchProvider({
    clientId: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET
})

// https://astro.build/config
export default defineConfig({
    output: 'server',
    integrations: [
        auth({
            providers: [
                twitch
            ]
        })
    ],
    adapter: node({
        mode: 'standalone'
    })
});
