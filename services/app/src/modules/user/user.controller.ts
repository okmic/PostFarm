import { FastifyRequest, FastifyReply } from "fastify";
import { successResponse } from "../../pkg/request/response.handler";
import { ErrorNotAuth } from "../../pkg/errors/errors";
import { User } from "../../models/User.model";
import { getFullRootUser, isRootUser } from "../../pkg/config/sign/sign.util";
import appconfig from "../../pkg/config/appconfig";
import userService from "./user.service";

class UserController {

    async getMe(req: FastifyRequest, reply: FastifyReply) {
        const reqUserId = (req?.user as any)?.id

        if (reqUserId === appconfig.rootUser.id) {
            return successResponse("success", { user: getFullRootUser() }, reply)
        }

        if (!reqUserId) throw new ErrorNotAuth()
        const user = await User.findOne({ _id: reqUserId }, { psw: 0 })

        return successResponse("success", { user }, reply)
    }

    async updateUser(req: FastifyRequest<{ Body: { name: string, psw: string } }>, reply: FastifyReply): Promise<void> {
        const reqUserId = (req?.user as any)?.id
        const { name, psw } = req.body
        if (!reqUserId) {
            throw new ErrorNotAuth()
        }

        const result = await userService.updateUser({ id: reqUserId, name, psw })

        return successResponse("success", { result }, reply)
    }
}

export default new UserController()
