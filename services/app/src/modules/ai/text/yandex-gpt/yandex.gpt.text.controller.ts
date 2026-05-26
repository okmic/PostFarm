import { FastifyReply, FastifyRequest } from "fastify";
import yandexGptTextService from "./yandex.gpt.text.service";
import appconfig from "../../../../pkg/config/appconfig";
import { successResponse } from "../../../../pkg/request/response.handler";

class YandexGptTextController {

    async textGenerate(req: FastifyRequest<{ Body: { temperature: number, prompt: string, systemPromt: string, msg: string } }>, reply: FastifyReply) {
        const result = await yandexGptTextService.YGpt({
            temperature: req.body.temperature,
            prompt: req.body.systemPromt,
            msg: req.body.msg,
            YandexOAuthToken: appconfig.services.ai.text.yandex.OAuthToken,
            YandexFolderID: appconfig.services.ai.text.yandex.XFolderId,
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }
}

export default new YandexGptTextController()