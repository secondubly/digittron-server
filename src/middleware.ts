export async function onRequest({ locals, request }, next) {
    locals.title = "New title"
    console.log(request.session)

    return next()
}