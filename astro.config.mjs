import { defineConfig } from 'astro/config'
import node from "@astrojs/node"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  integrations: [tailwind()]
});