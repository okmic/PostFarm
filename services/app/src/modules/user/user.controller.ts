import { FastifyRequest, FastifyReply } from "fastify";
import { successResponse } from "../../pkg/request/response.handler";
import { ErrorNotAuth } from "../../pkg/errors/errors";
import { User } from "../../models/User.model";

class UserController {

async getMe(req: FastifyRequest, reply: FastifyReply) {
    const reqUserId = (req?.user as any)?.id
    console.log(reqUserId, "-----------------")
    if(!reqUserId) throw new ErrorNotAuth()
    const user = await User.findOne({ _id: reqUserId }, { psw: 0 })
    console.log(user)
    return successResponse("success", { user }, reply)
}
}

export default new UserController()
