import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { ErrorNotAuth, ErrorForbidden } from '../errors/errors'

const userJWTPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    fastify.log.info({ url: request.url, method: request.method }, 'Checking auth for route')
    
    const publicRoutes = [
      '/api',
      '/api/ping',
      '/api/signin',
      '/api/signup',
      '/api/refresh-token'
    ]
    
    if (publicRoutes.includes(request.url)) {
      fastify.log.info({ url: request.url }, 'Public route, skipping auth')
      return
    }
    
    const isPublicPrefix = publicRoutes.some(route => request.url.startsWith(route))
    if (isPublicPrefix) {
      fastify.log.info({ url: request.url }, 'Public route prefix, skipping auth')
      return
    }
    
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
      fastify.log.info({ url: request.url }, 'Auth successful')
    } catch (error) {
      fastify.log.error({ error, url: request.url }, 'Auth failed')
      
      if (error instanceof ErrorNotAuth) {
        throw error
      }
      throw new ErrorForbidden('Invalid or expired token')
    }
  })
}

export default fp(userJWTPlugin, {
  name: 'user-jwt-plugin',
  dependencies: ['@fastify/jwt']
})