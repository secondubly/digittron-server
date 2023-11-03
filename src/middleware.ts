export async function onRequest({ locals, request }, next) {
    locals.title = "Hello"
    return next()
}