import { FastifyRequest, FastifyReply } from "fastify"
import referralLinkService from "./referralLink.service"
import { successResponse } from "../../pkg/request/response.handler"
import { IReferralLinkType } from "../../models/ReferralLink.model"

class ReferralLinkController {
    async find(req: FastifyRequest, reply: FastifyReply) {
        const links = await referralLinkService.find()
        return successResponse("success", { links }, reply)
    }

    async create(req: FastifyRequest<{
        Body: {
            code: string
            creationLimit: number
            source: string
            rate: number
            role: string
        }
    }>, reply: FastifyReply) {
        const link = await referralLinkService.create(req.body)
        return successResponse("Ссылка создана", { link }, reply)

    }

    async update(req: FastifyRequest<{
        Params: { id: string }
        Body: Partial<IReferralLinkType>
    }>, reply: FastifyReply) {
        const link = await referralLinkService.update(req.params.id, req.body)
        return successResponse("Ссылка обновлена", { link }, reply)
    }

    async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        await referralLinkService.delete(req.params.id)
        return successResponse("Ссылка удалена", { deleted: true }, reply)
    }
}

export default new ReferralLinkController()