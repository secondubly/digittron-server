"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const server = (0, fastify_1.default)();
server.register(postgres_1.default, {
    connectionString: "postgres://postgres:postgres@localhost/digittron",
});
server.get("/ping", async (_request, _reply) => {
    return "PONG";
});
server.post("/register", async (req, res) => {
    const { username, password } = req.body.formData;
    const saltRounds = 10;
    const client = await server.pg.connect();
    try {
        await bcrypt_1.default.hash(password, saltRounds, async (err, hashedPassword) => {
            const id = await client.query("INSERT INTO user_(username, password) VALUES ($1, $2)", [username, hashedPassword]);
            console.log(id);
        });
    }
    catch (e) {
        console.error("error", e);
    }
    finally {
        client.release();
    }
    // await bcrypt.compare(password, tempStore, (err, result) => {
    // 	console.log("tempStore", tempStore)
    // 	console.log("compare result", result)
    // })
});
server.post("/handleLogin", async (req, res) => {
    const { username, password } = req.body.formData;
    const client = await server.pg.connect();
    try {
        const { rows } = await client.query("SELECT password FROM user_ WHERE username = $1", [username]);
        if (rows.length > 1) {
            const hashedPassword = rows[0];
            const result = await bcrypt_1.default.compare(password, hashedPassword, (err, result) => {
                console.log(err);
                if (err) {
                    // Handle error
                    console.error("Error comparing passwords:", err);
                    return;
                }
                console.log("result async", result);
            });
            console.log("result", result);
        }
        console.log(rows);
    }
    catch (e) {
        console.error("error", e);
    }
    finally {
        client.release();
    }
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
