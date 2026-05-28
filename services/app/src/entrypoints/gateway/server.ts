import fastify from "fastify"
import formBody from "@fastify/formbody"
import cors from '@fastify/cors'
import config from "../../pkg/config/appconfig"
import fastifyJwt from '@fastify/jwt'
import fastifyStatic from "@fastify/static"
import httpProxy from "@fastify/http-proxy"
import cookie from "@fastify/cookie"
import errorHandlerPlugin from "../../pkg/plugins/global.errors.plugin"
import SignModule from "../../modules/sign/sign.module"
import usersAuthPlugin from "../../pkg/plugins/users.auth.plugin"
import appconfig from "../../pkg/config/appconfig"
import { cheackOrCreateInitFoldersAndFiles, getPath } from "../../utils/paths.util"
import { setupGlobalErrorHandlers } from "../../pkg/errors/error-handler"
import { initializeDatabase } from "../../pkg/db/db.init"
import appInstance from "../../pkg/appInstance/appInstance"
import UserModule from "../../modules/user/user.module"

(async () => {
  const server = fastify({ logger: true })
  
  // 1. Базовые плагины
  await server.register(formBody)
  await server.register(cookie)
  await server.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    decoratorName: 'jwt'
  })
  await server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
  await server.register(fastifyStatic, {
    root: getPath("static"),
    prefix: "/api/public",
    decorateReply: false
  })
  
  server.register(errorHandlerPlugin)
  
  if (!server.jwt) throw new Error('JWT plugin not initialized')
  appInstance.setApp(server)
  
  server.get('/api', async (_, reply) => reply.send({ msg: "pong" }))
  new SignModule(server) 
  
  server.register(usersAuthPlugin)
  new UserModule(server)
  
await server.register(httpProxy, {
  upstream: appconfig.services.ai.text.uri, 
  prefix: '/api/ai/text/post-chronicle',
  rewritePrefix: '/api/ai/text/post-chronicle', 
  replyOptions: {
    rewriteRequestHeaders: (_originalReq, headers) => {
      return {
        ...headers,
        authorization: server.jwt.sign({ id: "root", role: "root", rate: "4" }),
      }
    }
  }
})
await server.register(httpProxy, {
  upstream: appconfig.services.ai.text.uri,
  prefix: '/api/ai/text/channel-content',
  rewritePrefix: '/api/ai/text/channel-content', 
  replyOptions: {
    rewriteRequestHeaders: (_originalReq, headers) => {
      return {
        ...headers,
        authorization: server.jwt.sign({ id: "root", role: "root", rate: "4" }),
      }
    }
  }
})

  try {
    await cheackOrCreateInitFoldersAndFiles()
    setupGlobalErrorHandlers()
    await initializeDatabase()
    await server.listen({
      port: appconfig.services.gateway.PORT,
      host: '0.0.0.0'
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
})()