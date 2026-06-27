import { User } from "../models/User.model"
import { ErrorForbidden } from "../pkg/errors/errors"

export const cheackJwtInHeader = async (req: any, reply: any, next: () => void) => {
    try {
        req.user = await req.jwtVerify({})
    } catch (e) {
        return reply.status(401).send({ errorMsg: "Not Auth" })
    }
}

export const cheackJwtInHeaderRoot = async (req: any, reply: any, next: () => void) => {
    try {
        const user = await req.jwtVerify({})
        if(
           user.role !== "root"
        ) {
            throw new ErrorForbidden()
        }

        return user
    } catch (e) {
        return reply.status(401).send({ errorMsg: "Not Auth" })
    }
}
