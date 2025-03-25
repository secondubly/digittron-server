import fastify, { FastifyRequest } from "fastify"
import postgres from "@fastify/postgres"
import bcrypt from "bcrypt"

const server = fastify()

interface SignupRequest {
	formData: {
		username: string
		password: string
	}
}
server.register(postgres, {
	connectionString: "postgres://postgres:postgres@localhost/digittron",
})

server.get("/ping", async (_request, _reply) => {
	return "PONG"
})

server.post(
	"/register",
	async (req: FastifyRequest<{ Body: SignupRequest }>, res) => {
		const { username, password } = req.body.formData
		const saltRounds = 10

		const client = await server.pg.connect()
		try {
			await bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
				const id = await client.query(
					"INSERT INTO user_(username, password) VALUES ($1, $2)",
					[username, hashedPassword]
				)

				console.log(id)
			})
		} catch (e) {
			console.error("error", e)
		} finally {
			client.release()
		}

		// await bcrypt.compare(password, tempStore, (err, result) => {
		// 	console.log("tempStore", tempStore)
		// 	console.log("compare result", result)
		// })
	}
)

server.post(
	"/handleLogin",
	async (req: FastifyRequest<{ Body: SignupRequest }>, res) => {
		const { username, password } = req.body.formData

		const client = await server.pg.connect()
		try {
			const { rows } = await client.query(
				"SELECT password FROM user_ WHERE username = $1",
				[username]
			)

			if (rows.length) {
				const { password: hashedPassword } = rows[0]
				await bcrypt.compare(password, hashedPassword, (err, result) => {
					if (err) {
						// Handle error
						console.error("Error comparing passwords:", err)
						return
					}

					if (result) {
						return "login success"
					} else {
						return "login failed"
					}
				})
			}
		} catch (e) {
			console.error("error", e)
		} finally {
			client.release()
		}
	}
)

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})
