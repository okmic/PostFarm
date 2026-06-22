import { FastifyReply } from "fastify";
import appInstance from "../../appInstance/appInstance";
import appconfig from "../appconfig";
import { IUser } from "../../../models/User.model";

export const isRootUser = (email: string, psw: string): boolean => {
    if (email === appconfig.rootUser.email && psw === appconfig.rootUser.psw) {
        return true
    } else {
        return false
    }
}

export const signRootUser = (reply: FastifyReply) => {
    const access = appInstance.getInstance().jwt.sign({ id: "admin", role: "admin", rate: 0 }, { expiresIn: "15d" })
    const refresh = appInstance.getInstance().jwt.sign({ id: "admin", role: "admin", rate: 0 }, { expiresIn: "30d" })

    return reply
        .setCookie(
            'refreshToken',
            refresh,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 30 * 24 * 60 * 60
            }
        )
        .status(200)
        .send({
            status: 'success',
            auth: true, accessToken: access, refreshToken: refresh,
            user: getFullRootUser()
        })
}

export const getFullRootUser = (psw?: boolean): Partial<IUser> => {
    const { rootUser } = appconfig
    return { _id: rootUser.id, email: rootUser.email, psw: psw ? rootUser.psw : "", role: "admin", rate: 0 }
}