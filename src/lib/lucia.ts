import { lucia } from "lucia"
import { astro } from "lucia/middleware";
import { prisma as adapter } from "@lucia-auth/adapter-prisma"
import { createContext } from "@secondubly/digittron-db"
export const { prisma } = await createContext()

const ONE_DAY =     86400000; // 24 hours in milliseconds
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
    },
    sessionExpiresIn: {
        activePeriod: ONE_DAY,
        idlePeriod: ONE_DAY * 3 // three days
    }
});

export type Auth = typeof auth