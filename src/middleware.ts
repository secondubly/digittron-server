// src/middleware.ts
import 'dotenv/config'
import { auth } from "./lib/lucia";
import type { MiddlewareHandler } from "astro"
import { createClient } from 'redis'

export const redis = await createClient({
	url: process.env.REDIS_URL,
	socket: {
		reconnectStrategy: retries => Math.min(retries * 10, 100)
	}
})
	.on('error', err => console.log('Redis Client Error', err))
	.connect()

export const onRequest: MiddlewareHandler = async (context, next) => {
	context.locals.auth = auth.handleRequest(context);		
	return await next();
}