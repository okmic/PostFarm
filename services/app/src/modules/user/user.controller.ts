import { FastifyRequest, FastifyReply } from "fastify";
import { successResponse } from "../../pkg/request/response.handler";
import { ErrorNotAuth } from "../../pkg/errors/errors";
import { IUser, User } from "../../models/User.model";
import { getFullRootUser } from "../../pkg/config/sign/sign.util";
import appconfig from "../../pkg/config/appconfig";
import userService from "./user.service";

class UserController {

    async find(_req: FastifyRequest, reply: FastifyReply) {
        const users = await userService.find()

        return successResponse("success", { users }, reply)
    }

    async getMe(req: FastifyRequest, reply: FastifyReply) {
        const reqUserId = (req?.user as any)?.id

        if (reqUserId === appconfig.rootUser.id) {
            return successResponse("success", { user: getFullRootUser() }, reply)
        }

        if (!reqUserId) throw new ErrorNotAuth()
        const user = await User.findOne({ _id: reqUserId }, { psw: 0 })

        return successResponse("success", { user }, reply)
    }

    async updateUser(req: FastifyRequest<{ Body: { name: string, psw: string, featuredServices?: IUser["featuredServices"] } }>, reply: FastifyReply): Promise<void> {
        const reqUserId = (req?.user as any)?.id
        const { name, psw, featuredServices } = req.body
        if (!reqUserId) {
            throw new ErrorNotAuth()
        }

        const result = await userService.updateUser({ id: reqUserId, name, psw, featuredServices })

        return successResponse("success", { result }, reply)
    }

    async updateSomeUser(req: FastifyRequest<{ Body: Partial<IUser>, Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
        const { userId } = req.params
        const payload = req.body
        if (!userId) {
            throw new ErrorNotAuth()
        }

        const result = await userService.rootUpdate({ id: userId, payload })

        return successResponse("success", { result }, reply)
    }
}

export default new UserController()
