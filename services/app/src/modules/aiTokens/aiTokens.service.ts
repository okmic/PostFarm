import { AITokens } from "../../models/AITokens.model"
import { User } from "../../models/User.model"
import { ErrorNotAuth } from "../../pkg/errors/errors"
import { IGetAiTokensConfigProps } from "./types"

class AiTokensService {
  async usageTokens(props: IGetAiTokensConfigProps) {
    const user = await User.findById(props.userId)
    if (!user) {
      throw new ErrorNotAuth()
    }

    const limit = user.rate === 0 ? 1000 : user.rate

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayTokens = await AITokens.find({
      userId: user._id,
      createdAt: { $gte: todayStart }
    })

    const history = await AITokens
    .find({ userId: user._id })
    .sort({ createdAt: -1 })

    return {
      usageTokens: {
        limit: limit,
        usedToday: todayTokens.length,
        history
      }
    }
  }
}

export default new AiTokensService()
