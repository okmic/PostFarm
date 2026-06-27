import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { ErrorNotAuth, ErrorForbidden, ErrorAIRateLimitIsOver } from '../errors/errors'
import { User } from '../../models/User.model'
import { AITokens } from '../../models/AITokens.model'

const userJWTPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const reqUserId = (request?.user as any)?.id

      if (!reqUserId) {
        throw new ErrorForbidden('Пользователь не опознан')
      }
      const user = await User.findById(reqUserId)
      if (!user) {
        throw new ErrorNotAuth()
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

      fastify.log.info({ url: request.url }, 'Au')
    } catch (error) {
      fastify.log.error(error)
      throw new ErrorAIRateLimitIsOver()
    }
  })
}

export default fp(userJWTPlugin, {
  name: 'ai-rate-plugin',
})