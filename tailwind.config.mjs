/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js'],
	theme: {
		extend: {
			colors: {
				'twitch-purple': '#9146FF',
				'ice': '#F0F0FF'
			}
		}
	},
	plugins: [
		require('flowbite/plugin')
	],
}
