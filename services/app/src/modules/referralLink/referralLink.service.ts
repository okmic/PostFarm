import { type IReferralLinkType, ReferralLink } from "../../models/ReferralLink.model"

class ReferralLinkService {
  async find() {
    return ReferralLink.find().sort({ date: -1 }).lean()
  }

  async findById(id: string) {
    return ReferralLink.findById(id)
  }

  async findByCode(code: string) {
    return ReferralLink.findOne({ code, active: true })
  }

  async create(data: {
    code: string
    creationLimit: number
    source: string
    rate: number
    role: string
  }) {
    const existing = await ReferralLink.findOne({ code: data.code })
    if (existing) {
      throw new Error("Ссылка с таким кодом уже существует")
    }

    return ReferralLink.create({
      ...data,
      createdByLink: 0,
      active: true,
    })
  }

  async update(id: string, data: Partial<IReferralLinkType>) {
    const link = await ReferralLink.findById(id)
    if (!link) {
      throw new Error("Ссылка не найдена")
    }

    return ReferralLink.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id: string) {
    const link = await ReferralLink.findById(id)
    if (!link) {
      throw new Error("Ссылка не найдена")
    }

    return ReferralLink.findByIdAndDelete(id)
  }

  async incrementUsage(code: string) {
    return ReferralLink.findOneAndUpdate(
      { code, active: true },
      { $inc: { createdByLink: 1 } },
      { new: true }
    )
  }

  async checkLimit(code: string): Promise<boolean> {
    const link = await ReferralLink.findOne({ code, active: true })
    if (!link) return false
    return link.createdByLink < link.creationLimit
  }
}

export default new ReferralLinkService()
