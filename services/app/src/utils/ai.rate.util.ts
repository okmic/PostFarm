import { ErrorAIRateLimitIsOver } from '../pkg/errors/errors'
import { User } from '../models/User.model'
import { Types } from 'mongoose'
import { logger } from '../pkg/logger/logger.service'
import { AITokens } from '../models/AITokens.model'

export const AIRateLimitHandler = async (userId: string | Types.ObjectId) => {
  try {
    console.log(userId, "-1-____________________------------------_______________-------------_____________------------")

    const user = await User.findById(userId)
    console.log(user, "-____________________------------------_______________-------------_____________------------")

    if(!user) {
      throw new ErrorAIRateLimitIsOver()
    }
    console.log("0-____________________------------------_______________-------------_____________------------")
    
    if (user.rate === 0) {
      return
    }
    console.log("1-____________________------------------_______________-------------_____________------------")

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayTokens = await AITokens.find({
      userId: user._id,
      createdAt: { $gte: todayStart }
    })
    console.log("2-____________________------------------_______________-------------_____________------------")

    if (todayTokens.length >= user.rate) {
      throw new ErrorAIRateLimitIsOver()
    }
    console.log("3-____________________------------------_______________-------------_____________------------")

    return
  } catch (error) {
    logger.error(`Invalid cheack rate limit`)
    throw new ErrorAIRateLimitIsOver()
  }
}


export const getRateConfig = (rate: number) => {
  if (rate === 0) return 0
  if (rate <= 3) return 1
  if (rate <= 10) return 2
  if (rate <= 50) return 3
  if (rate <= 100) return 4
  return 5
}