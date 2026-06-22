import fastify from "fastify"
import formBody from "@fastify/formbody"
import cors from '@fastify/cors'
import config from "../../../pkg/config/appconfig"
import fastifyJwt from '@fastify/jwt'
import cookie from "@fastify/cookie"
import appconfig from "../../../pkg/config/appconfig"
import { setupGlobalErrorHandlers } from "../../../pkg/errors/error-handler"
import appJwtPlugin from "../../../pkg/plugins/app.auth.plugin"
import AITextModule from "../../../modules/ai/text/ai.text.module"
import { initializeDatabase } from "../../../pkg/db/db.init"

(async () => {
  const server = fastify({ logger: true })
  await server.register(formBody)
  await server.register(cookie)
  await server.register(fastifyJwt, {
    secret: config.services.ai.text.JWT_SECRET,
    decoratorName: 'jwt'
  })
  await server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
  if (!server.jwt) throw new Error('JWT plugin not initialized')
  server.register(appJwtPlugin)
  server.get('/api', async (_, reply) => reply.send({ msg: "pong" }))
  new AITextModule(server)

  try {
    setupGlobalErrorHandlers()
    await initializeDatabase()
    
    await server.listen({
      port: appconfig.services.ai.text.PORT,
      host: '0.0.0.0'
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
})()

