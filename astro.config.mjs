import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

export default defineConfig({
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
  output: "server",
  adapter: node({
    mode: "standalone"
  })
})