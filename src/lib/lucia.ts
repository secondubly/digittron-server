import { lucia } from "lucia"
import { astro } from "lucia/middleware";
import { prisma as adapter } from "@lucia-auth/adapter-prisma"
import { createContext } from "@secondubly/digittron-db"
export const { prisma } = await createContext()

export const auth = lucia({
    env: "DEV",
    middleware: astro(),
    adapter: adapter(prisma, {
        user: "user",
        key: "key",
        session: "session"
    }),
    getUserAttributes: (data) => {
        return {
            username: data.username
        }
    }
});

export type Auth = typeof auth