import { FastifyReply, FastifyRequest } from "fastify";
import { successResponse } from "../../pkg/request/response.handler";
import aiTokensService from "./aiTokens.service";

class AiTokensController {

    async getUsageTokens(req: FastifyRequest, reply: FastifyReply) {
        const reqUserId = (req?.user as any)?.id

        const usageTokens = await aiTokensService.usageTokens({ userId: reqUserId })

        return successResponse("success", usageTokens, reply)
    }

}

export default new AiTokensController()
