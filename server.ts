import fastify from "fastify"
import postgres from "@fastify/postgres"
const server = fastify()

server.register(postgres, {
	connectionString: "postgres://postgres:postgres@localhost/digittron",
})

server.get("/ping", async (_request, _reply) => {
	const client = await server.pg.connect()

	const result = await client.query<{ total: number }>(
		"SELECT COUNT(*) as total FROM user_"
	)

	console.log(result.rows[0].total)

	client.release()
	return `total: ${result.rows[0].total}\n`
})

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})
