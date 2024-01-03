import type { APIRoute } from "astro"
import { createContext } from "@secondubly/digittron-db"

export const DELETE: APIRoute = async({ request, redirect }) => {
    console.log(request.body)
    const { command }= await request.json()

    if (!command)  {
        return new Response(JSON.stringify({
            message: "Missing required data."
        }), { status: 400 })
    }

    const { prisma }  = await createContext()
    const result = await prisma.commands.delete({
        where: {
            name: command
        }
    })

    if (!result) {
        return new Response(JSON.stringify({
            message: 'Could not find command.'
        }), { status: 410 })
    } else if (result.name !== command) {
        return new Response(JSON.stringify({
            message: 'Deleted object does not match requested object.'
        }), { status: 404 })
    } else {
        return new Response(JSON.stringify({
            message: 'OK'
        }), { status: 200 })
    }
}