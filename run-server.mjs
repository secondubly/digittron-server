import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import fastifyIO from 'fastify-socket.io'

const app = Fastify({ logger: true });

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/client', import.meta.url)),
  })
  .register(fastifyMiddie)
  .register(fastifyIO);
app.use((req, res, next) => {
    ssrHandler(req, res, next)
});

app.ready().then(() => {
    app.io.on('connection', (socket) => {
        console.log('Connection established')
    })
})

app.listen({ port: 3000 })