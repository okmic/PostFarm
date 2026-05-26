import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { ErrorForbidden, ErrorNotAuth } from '../errors/errors'

const appJWTPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization
      
      if (!authHeader) {
        throw new ErrorNotAuth('No token provided')
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader

      if (!token) {
        throw new ErrorNotAuth('Token is missing')
      }

      await request.server.jwt.verify(token)
    } catch (error) {
      throw new ErrorForbidden('Invalid or expired token')
    }
  })
}

export default fp(appJWTPlugin, {
  name: 'app-jwt-plugin',
  dependencies: ['@fastify/jwt']
})