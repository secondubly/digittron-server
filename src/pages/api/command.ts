import type { APIRoute } from "astro"
import * as Prisma from "@secondubly/digittron-db"
import { $Enums } from '@prisma/client'

export const POST: APIRoute = async({ request, redirect }) => {
    const data = await request.formData()

    const command = data.get("command")!.toString()
    const response = data.get("message")!.toString()
    const permLevel = data.get("permission-level")!.toString() as $Enums.PermissionLevel
    const cooldown =  parseInt(data.get('cooldown-timer')?.toString() ?? '5')

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
            response: response,
            cooldown: cooldown
        }
    })

    return redirect('/commands/custom', 307) // redirect back to commands page
}

export const DELETE: APIRoute = async({ request, redirect }) => {
    console.log(request.body)
    const { command }= await request.json()

    if (!command)  {
        return new Response(JSON.stringify({
            message: "Missing required data."
        }), { status: 400 })
    }

    const { prisma }  = await Prisma.createContext()
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

export const PUT: APIRoute = async({ request, redirect }) => {
    const data = await request.formData()

    const command = data.get("command")?.toString()
    const response = data.get("message")?.toString()
    const permLevel = data.get("permission-level")?.toString().toUpperCase() as $Enums.PermissionLevel
    const cooldownData = data.get("cooldown-timer")?.toString() ?? '5'

    if (!command) {
        return new Response(null, { status: 422 })
    }

    const { prisma } = await Prisma.createContext()
    let result = await prisma.commands.findUnique({
        where: {
            name: command
        },
        select: {
            name: true
        }
    })

    if (!result) {
        return new Response(null, { status: 422 })
    }

    const cooldown = parseInt(cooldownData)
    const oldCommandName = result.name

    try {
        const res = await prisma.commands.update({
            where: {
                name: oldCommandName,
            },
            data: {
                response: response || undefined,
                cooldown: cooldown,
                command_permissions: {
                    update: {
                        where: {
                            name: oldCommandName,
                        },
                        data: {
                            name: command,
                            level: permLevel
                        },
                    },
                },
            },
            include: {
                command_permissions: true,
            },
        })
    } catch (e) {
        
    }

    return redirect('../commands/custom', 307)
}