import { defineConfig } from 'astro/config'
import fastify from '@matthewp/astro-fastify'

// https://astro.build/config
/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
    output: 'server',
    adapter: fastify({
        entry: new URL('./src/pages/api/index.ts', import.meta.url)
    })
});
