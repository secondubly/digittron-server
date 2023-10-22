import Fastify, { FastifyInstance, FastifyError } from 'fastify'


interface TwitchAuthRequest {
    code: string,
    scope: string,
    state: string
}

const server: FastifyInstance = Fastify()

server.get('/', async(req, res) => {
    return 'hello world\n'
})

server.get('/ping', async(_req, _res) => {
    return 'pong\n'
})

server.get<{
    Querystring: TwitchAuthRequest
}>('/digittron', async(req, res) => {
    const { code } = req.query
    console.log(req)
})

server.listen({ port: 3000 })
    .then((address) => console.log(`Server listening on ${address}`))
    .catch((err: FastifyError) => {
        console.error(err)
        process.exit(1)
    })