import Fastify, { FastifyInstance, FastifyError } from 'fastify'
import { OAuth2Namespace, fastifyOauth2 as oauthPlugin } from '@fastify/oauth2'

// TODO: move this to augments folder
declare module 'fastify' {
    interface FastifyInstance {
        twitchOauth2: OAuth2Namespace
    }
}
const server: FastifyInstance = Fastify()
const TWITCH_STATE = 'c3ab8aa609ea11e793ae92361f002671'
server.register(oauthPlugin, {
    name: 'twitchOauth2',
    scope: ['chat:edit', 'chat:read'],
    credentials: {
        client: {
            id: process.env.CLIENT_ID!,
            secret: process.env.CLIENT_SECRET!
        },
        auth: oauthPlugin.TWITCH_CONFIGURATION
    },
    generateStateFunction: () => { return TWITCH_STATE },
    checkStateFunction: (request: any, callback: any) => { 
        const state = request.query.state
        if (state && state === TWITCH_STATE) {
            callback()
            return
        }
        callback(new Error('Invalid state'))
    },
    tokenRequestParams: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    },
    startRedirectPath: '/digittron',
    callbackUri: 'http://localhost:3000/digittron/callback'
    
})

server.get('/', async(req, res) => {
    return 'hello world\n'
})

server.get('/ping', async(_req, _res) => {
    return 'pong\n'
})

server.get('/digittron/callback', async(req, reply) => {
    try {
        const { token } = await server.twitchOauth2.getAccessTokenFromAuthorizationCodeFlow(req)
        // TODO: salt + store token data in

    } catch (err) {
        console.error("failed to get token", err)
    }
})

server.listen({ port: 3000 })
    .then((address) => console.log(`Server listening on ${address}`))
    .catch((err: FastifyError) => {
        console.error(err)
        process.exit(1)
    })