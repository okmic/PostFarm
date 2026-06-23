import { ErrorAIRateLimitIsOver } from '../pkg/errors/errors'
import { IUser, User } from '../models/User.model'
import { Types } from 'mongoose'
import { logger } from '../pkg/logger/logger.service'
import { AITokens } from '../models/AITokens.model'

export const AIRateLimitHandler = async (userId: string | Types.ObjectId) => {
  try {
    const user = await User.findById(userId)
    if(!user) {
      throw new ErrorAIRateLimitIsOver()
    }
    if (user.rate === 0) {
      return
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayTokens = await AITokens.find({
      userId: user._id,
      createdAt: { $gte: todayStart }
    })

    if (todayTokens.length >= user.rate) {
      throw new ErrorAIRateLimitIsOver()
    }

    return
  } catch (error) {
    logger.error(`Invalid cheack rate limit`)
    throw new ErrorAIRateLimitIsOver()
  }
}
