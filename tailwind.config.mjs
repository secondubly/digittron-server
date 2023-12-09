/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js'
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'twitch-purple': {
					DEFAULT: '#9146FF',
					dark: '#3b0764'
				},
				'ice': '#F0F0FF'
			}
		}
	},
	plugins: [
		require('flowbite/plugin')
	],
}