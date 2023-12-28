import type { APIRoute } from "astro"
import * as Prisma from "@secondubly/digittron-db"
import { $Enums } from '@prisma/client'
export const POST: APIRoute = async({ request, redirect }) => {
    const data = await request.formData()

    const command = data.get("command")!.toString()
    const response = data.get("message")!.toString()
    const permLevel = data.get("permission-level")!.toString() as $Enums.PermissionLevel
    let alias = data.get("alias")
    let aliasArray: string[] = []

    // parse aliases
    if (alias && alias !== '') {
        const parsedAliases = alias.toString().trim()
        aliasArray = parsedAliases.split(',') ?? parsedAliases.split(" ")
    }

    const { prisma }  = await Prisma.createContext()
    await prisma.commandPermission.create({
        data: {
            name: command,
            level: permLevel
        }
    })

    
    await prisma.commands.create({
        data: {
            name: command,
            aliases: aliasArray,
            response: response
        }
    })

    return redirect('/commands/custom', 307) // redirect back to commands page
}