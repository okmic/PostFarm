import { FastifyReply, FastifyRequest } from "fastify";
import yandexGptTextService from "./ai.text.service";
import appconfig from "../../../pkg/config/appconfig";
import { errorResponse, successResponse } from "../../../pkg/request/response.handler";
import type { EducationContentEnum, EducationLevelEnum, HeadlineContentEnum, HeadlineStyleEnum, PostChannelContentToneEnum, PostChannelContentTypeEnum, PostChronicleTypeEnum } from "../../../../../../pkg/types/ai.text.types"
import { generatePostChroniclePrompt } from "./prompts/ai.text.post-chronicle.prompt";
import { generateChannelContentPrompt } from "./prompts/ai.text.post-channel-content.prompt";
import { generateHeadlinePrompt } from "./prompts/ai.viralHeadlines.prompt";
import { generateEducationPrompt } from "./prompts/ai.educationPost.prompt";

class AITextController {

    async postChronicle(req: FastifyRequest<{ Body: { type: PostChronicleTypeEnum, text: string } }>, reply: FastifyReply) {
        const result = await yandexGptTextService.YGpt({
            temperature: 0.7,
            prompt: null,
            msg: generatePostChroniclePrompt(req.body.type, req.body.text),
            YandexOAuthToken: appconfig.services.ai.text.yandex.OAuthToken,
            YandexFolderID: appconfig.services.ai.text.yandex.XFolderId,
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }

    async channelContent(req: FastifyRequest<{ Body: { text: string, type: PostChannelContentTypeEnum, tone: PostChannelContentToneEnum } }>, reply: FastifyReply) {

        const result = await yandexGptTextService.YGpt({
            temperature: 0.7,
            prompt: null,
            msg: generateChannelContentPrompt(req.body.type, req.body.tone, req.body.text),
            YandexOAuthToken: appconfig.services.ai.text.yandex.OAuthToken,
            YandexFolderID: appconfig.services.ai.text.yandex.XFolderId,
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }

    async viralHeadlines(
        req: FastifyRequest<{
            Body: {
                topic: string
                type: HeadlineContentEnum
                style: HeadlineStyleEnum
            }
        }>,
        reply: FastifyReply
    ) {
        const { topic, type, style } = req.body

        const prompt = generateHeadlinePrompt(topic, type, style)

        const result = await yandexGptTextService.YGpt({
            temperature: 0.7,
            prompt: null,
            msg: prompt,
            YandexOAuthToken: appconfig.services.ai.text.yandex.OAuthToken,
            YandexFolderID: appconfig.services.ai.text.yandex.XFolderId,
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }

    async educationPost(
        req: FastifyRequest<{
            Body: {
                topic: string
                type: string
                level: string
            }
        }>,
        reply: FastifyReply
    ) {
        const { topic, type, level } = req.body

        const prompt = generateEducationPrompt(
            topic.trim(),
            type.toUpperCase() as EducationContentEnum,
            level.toUpperCase() as EducationLevelEnum
        )

        const result = await yandexGptTextService.YGpt({
            temperature: 0.7,
            prompt: null,
            msg: prompt,
            YandexOAuthToken: appconfig.services.ai.text.yandex.OAuthToken,
            YandexFolderID: appconfig.services.ai.text.yandex.XFolderId,
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }
}

export default new AITextController()
