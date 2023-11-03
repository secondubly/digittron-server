import { defineMiddleware } from "astro:middleware";
import crypto from 'crypto'
export const onRequest = defineMiddleware((context, next) => {
    if(context.url.pathname === '/') {
        // setup session data
    }

    next()
});