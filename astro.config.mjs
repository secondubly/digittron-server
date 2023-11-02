import { defineConfig } from 'astro/config';
import node from "@astrojs/node"
import auth from 'auth-astro'

// https://astro.build/config
export default defineConfig({
    integrations: [
        auth()
    ],
    output: 'server',
    adapter: node({
        mode: 'server'
    })
});
