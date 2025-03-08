"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const server = (0, fastify_1.default)();
server.register(postgres_1.default, {
    connectionString: "postgres://postgres:postgres@localhost/digittron",
});
server.get("/ping", async (_request, _reply) => {
    const client = await server.pg.connect();
    const result = await client.query("SELECT COUNT(*) as total FROM user_");
    console.log(result.rows[0].total);
    client.release();
    return `total: ${result.rows[0].total}\n`;
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
