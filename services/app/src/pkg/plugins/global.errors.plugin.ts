import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { 
  ErrorNotAuth, 
  ErrorBadRequest, 
  ErrorForbidden, 
  ErrorUploadFile, 
  ErrorAIRateLimitIsOver
} from '../errors/errors'

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async (error, request, reply) => {

    console.error('Global error handler:', error)
    const alertMsg = (request.body as any)?.alertMsg || (request.query as any)?.alertMsg
    
    if (error instanceof ErrorNotAuth) {
      return reply
        .status(401)
        .send({ 
          errorMsg: 'NOT AUTH', 
          error: { message: error.message }, 
          alertMsg 
        })
    }
    
    if (error instanceof ErrorBadRequest) {
      return reply
        .status(400)
        .send({ 
          errorMsg: 'Validate error', 
          error: { message: error.message }, 
          alertMsg 
        })
    }
    
    if (error instanceof ErrorForbidden) {
      return reply
        .status(403)
        .send({ 
          errorMsg: 'Forbidden', 
          error: { message: error.message }, 
          alertMsg 
        })
    }
    
    if (error instanceof ErrorUploadFile) {
      return reply
        .status(500)
        .send({ 
          errorMsg: 'Error upload file', 
          error: { message: error.message }, 
          alertMsg 
        })
    }

    if(error instanceof ErrorAIRateLimitIsOver) {
      return reply 
        .status(469)
        .send({ 
          errorMsg: 'AI Limit is over', 
          error: { message: error.message }, 
          alertMsg 
        })
    }

    if (error && typeof error === 'object' && 'validation' in error) {
      return reply
        .status(400)
        .send({ 
          errorMsg: 'Validation error', 
          error: { 
            message: (error as any).message,
            validation: (error as any).validation 
          }, 
          alertMsg 
        })
    }

    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as any).code
      if (errorCode === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
          errorCode === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED' ||
          errorCode === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
        return reply
          .status(401)
          .send({ 
            errorMsg: 'NOT AUTH', 
            error: { message: 'Invalid or expired token' }, 
            alertMsg 
          })
      }
    }

    return reply
      .status(500)
      .send({ 
        state: 'Some error', 
        error: { message: "Server error" }, 
        alertMsg 
      })
  })
}

export default fp(errorHandlerPlugin, {
  name: 'error-handler-plugin',
})