import type { DefineFastifyRoutes } from '@matthewp/astro-fastify';
import crypto from 'crypto'
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie'
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const THIRTY_MINS_MILLISECONDS = 30 * 60 * 1000
const redisClient = createClient();
redisClient.connect().catch(console.error)

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'digittron:'
})

const defineRoutes: DefineFastifyRoutes = (fastify) => {
    fastify.register(fastifyCookie)
    fastify.register(fastifySession, {
        store: redisStore,
        secret: crypto.randomBytes(24).toString('base64'),
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: THIRTY_MINS_MILLISECONDS
        },
        rolling: true
    })
    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: async(request, reply) => {

        },
        handler: async(request, reply) => {
            reply.send({
                body: 'hello'
            })
        }
    })
};

export default defineRoutes