
import type { APIRoute } from "astro"
import * as Prisma from "@secondubly/digittron-db"
import { $Enums } from '@prisma/client'

export const POST: APIRoute = async({ request, redirect }) => {
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

    const updateCommand = prisma.commands.update({
        where: {
            name: oldCommandName
        },
        data: {
            name: command,
            response: response || undefined,
            cooldown: cooldown
        }
    })

    const updateCommandPermissions = prisma.commandPermission.update({
        where: {
            name: oldCommandName
        },
        data: {
            name: command,
            level: permLevel
        }
    })

    // REVIEW: is there a cleaner way to do this?
    await prisma.$transaction([updateCommand, updateCommandPermissions])
    return redirect('commands/custom', 307)
}