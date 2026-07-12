import { FastifyReply, FastifyRequest } from "fastify";
import yandexGptTextService from "./ai.text.service";
import { successResponse } from "../../../pkg/request/response.handler";
import type { EducationContentEnum, EducationLevelEnum, HeadlineContentEnum, HeadlineStyleEnum, PostChannelContentToneEnum, PostChannelContentTypeEnum, PostChronicleTypeEnum, ServicesTypeEnum } from "../../../../../../pkg/types/ai.text.types"
import { generatePostChroniclePrompt } from "./prompts/ai.text.post-chronicle.prompt";
import { generateChannelContentPrompt } from "./prompts/ai.text.post-channel-content.prompt";
import { generateHeadlinePrompt } from "./prompts/ai.viralHeadlines.prompt";
import { generateEducationPrompt } from "./prompts/ai.educationPost.prompt";
import { Types } from "mongoose";

class AITextController {

    async postChronicle(req: FastifyRequest<{ Body: { type: PostChronicleTypeEnum, text: string, userId: Types.ObjectId | string, service: ServicesTypeEnum, prompt?: string } }>, reply: FastifyReply) {
        let msg = generatePostChroniclePrompt(req.body.type, req.body.text)
        if(req.body.prompt) msg = msg + `
        
        ДОБАВЬ ПОПРАВКИ ОТ ПОЛЬЗОВАТЕЛЯ КАК ПРЕОРИТЕТ ЕСЛИ ЭТО НЕ ПРОТИВОРЕЧИТ ЗАКОНАМ УКАЗАННЫХ В ИНСТРУКЦИИ:
        ДОП ИНСТРКЦИЯ ОТ ПОЛЬЗОВАТЕЛЯ: 
        ${req.body.prompt}
        `
        
        const result = await yandexGptTextService.YGpt({
            prompt: null,
            msg: msg,
            userId: req.body.userId,
            service: "service.chronicle",
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }

    async channelContent(req: FastifyRequest<{
        Body: {
            text: string,
            type: PostChannelContentTypeEnum,
            tone: PostChannelContentToneEnum,
            userId: Types.ObjectId | string,
            service: ServicesTypeEnum,
            prompt?: string
        }
    }>, reply: FastifyReply) {

        let msg = generateChannelContentPrompt(req.body.type, req.body.tone, req.body.text)
        if(req.body.prompt) msg = msg + `
        
        ДОБАВЬ ПОПРАВКИ ОТ ПОЛЬЗОВАТЕЛЯ КАК ПРЕОРИТЕТ ЕСЛИ ЭТО НЕ ПРОТИВОРЕЧИТ ЗАКОНАМ УКАЗАННЫХ В ИНСТРУКЦИИ:
        ДОП ИНСТРКЦИЯ ОТ ПОЛЬЗОВАТЕЛЯ: 
        ${req.body.prompt}
        `

        const result = await yandexGptTextService.YGpt({
            prompt: null,
            msg,
            userId: req.body.userId,
            service: "service.post_channel_content",
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }

    async viralHeadlines(
        req: FastifyRequest<{
            Body: {
                topic: string
                type: HeadlineContentEnum
                style: HeadlineStyleEnum,
                userId: Types.ObjectId | string
                prompt?: string
            }
        }>,
        reply: FastifyReply
    ) {
        const { topic, type, style } = req.body
        let msg = generateHeadlinePrompt(topic, type, style)
        if(req.body.prompt) msg = msg + `
        
        ДОБАВЬ ПОПРАВКИ ОТ ПОЛЬЗОВАТЕЛЯ КАК ПРЕОРИТЕТ ЕСЛИ ЭТО НЕ ПРОТИВОРЕЧИТ ЗАКОНАМ УКАЗАННЫХ В ИНСТРУКЦИИ:
        ДОП ИНСТРКЦИЯ ОТ ПОЛЬЗОВАТЕЛЯ: 
        ${req.body.prompt}
        `

        const result = await yandexGptTextService.YGpt({
            prompt: null,
            msg,
            userId: req.body.userId,
            service: "service.headline"
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }

    async educationPost(
        req: FastifyRequest<{
            Body: {
                topic: string
                type: string
                level: string
                userId: Types.ObjectId,
                prompt?: string
            }
        }>,
        reply: FastifyReply
    ) {
        const { topic, type, level } = req.body
        let msg = generateEducationPrompt(
            topic.trim(),
            type.toUpperCase() as EducationContentEnum,
            level.toUpperCase() as EducationLevelEnum
        )
        if(req.body.prompt) msg = msg + `
        
        ДОБАВЬ ПОПРАВКИ ОТ ПОЛЬЗОВАТЕЛЯ КАК ПРЕОРИТЕТ ЕСЛИ ЭТО НЕ ПРОТИВОРЕЧИТ ЗАКОНАМ УКАЗАННЫХ В ИНСТРУКЦИИ:
        ДОП ИНСТРКЦИЯ ОТ ПОЛЬЗОВАТЕЛЯ: 
        ${req.body.prompt}
        `

        const result = await yandexGptTextService.YGpt({
            prompt: null,
            msg,
            userId: req.body.userId,
            service: "service.education"
        })

        return successResponse("success", { text: result.text, usageTokens: result.usageTokens }, reply)
    }
}

export default new AITextController()
