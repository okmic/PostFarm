export const cheackJwtInHeader = async (req: any, reply: any, next: () => void) => {
    try {
        req.user = await req.jwtVerify({})
    } catch (e) {
        return reply.status(401).send({ errorMsg: "Not Auth" })
    }
}
