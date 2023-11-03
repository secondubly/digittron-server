import { defineMiddleware } from "astro:middleware";
export const onRequest = defineMiddleware((context, next) => {
    if(context.url.pathname === '/') {
        // setup session data
    }

    next()
});