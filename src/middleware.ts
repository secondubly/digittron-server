// src/middleware.ts
import 'dotenv/config'
import { auth } from "./lib/lucia";
import type { MiddlewareHandler, APIContext } from "astro"
import { URLSearchParams } from 'url'
import { createClient } from 'redis'

const client = await createClient()
	.on('error', err => console.log('Redis Client Error', err))
	.connect()

export const onRequest: MiddlewareHandler = async (context, next) => {
	if (context.url.pathname === '/spotify/callback') {
		const params = (context as APIContext).url.searchParams
		if (!params || !params.has('code') || !params.has('state')) {
			// return 404
		}

		const state = params.get('state') as string
		const code = params.get('code') as string
		// verify state code
		const cookie = context.cookies.get('spotify-state')?.value
		if (!cookie || cookie !== state) {
			// return 404
		}

		// get authorization token
		let url = 'https://accounts.spotify.com/api/token'
		const headers = new Headers()
		headers.set('Content-Type', 'application/x-www-form-urlencoded')
		headers.set('Authorization', 'Basic ' + Buffer.from(process.env.PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))

		const redirect_uri = (context as APIContext).url.origin + '/spotify/callback'
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: new URLSearchParams({
				'grant_type': 'authorization_code',
				'code': code,
				'redirect_uri': redirect_uri
			})
		})

		if (response.ok) {
			const jsonResponse = await response.json()
			client.set('spotify_access_token', jsonResponse.access_token)
			client.set('spotify_refresh_token', jsonResponse.refresh_token)
		} else {
			// ERROR
			console.log('Error', response.statusText)
			const jsonResponse = await response.json()
			console.log(jsonResponse)
		}
	} else if (context.url.pathname === '/setup') {
		if (context.url.searchParams.size !== 0) {
			console.log(context.url.searchParams)
			console.log('oauth')
		}
		
	} else {
		context.locals.auth = auth.handleRequest(context);		
	}
	return await next();
};