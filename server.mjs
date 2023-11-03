import RedisStore from 'connect-redis';
import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie'
import fastifyStatic from '@fastify/static'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import { fileURLToPath } from 'node:url'
import { Redis } from 'ioredis';
import RedisStore from 'connect-redis';
import { handler as ssrHandler } from './dist/server/entry.mjs'

const app = Fastify({ logger: true })

const store = new RedisStore({
  client: new Redis({
    enableAutoPipelining: true
  })
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: process.env.APP_SECRET,
  cookie: { secure: false },
  store
})

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/client', import.meta.url)),
  })
  .register(fastifyMiddie);
app.use(ssrHandler);

app.use((req, res, next) => {
  ssrHandler(req, res, next, locals);
})

app.listen({ port: 8888 });