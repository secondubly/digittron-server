import Fastify, { FastifyInstance, FastifyError } from 'fastify'

const server: FastifyInstance = Fastify()

server.get('/ping', async(_req, _res) => {
    return 'pong\n'
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})