import { FastifyInstance } from 'fastify';
import httpProxy from "@fastify/http-proxy"
import appconfig from '../../../pkg/config/appconfig';

export default class GptTextModule {
    
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance) {
        server.register(httpProxy, {
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

        server.register(httpProxy, {
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

        server.register(httpProxy, {
            upstream: appconfig.services.ai.text.uri,
            prefix: '/api/ai/text/viral-headlines',
            rewritePrefix: '/api/ai/text/viral-headlines',
            replyOptions: {
                rewriteRequestHeaders: (_originalReq, headers) => {
                    return {
                        ...headers,
                        authorization: server.jwt.sign({ id: "root", role: "root", rate: "4" }),
                    }
                }
            }
        })

        server.register(httpProxy, {
            upstream: appconfig.services.ai.text.uri,
            prefix: '/api/ai/text/education-post',
            rewritePrefix: '/api/ai/text/education-post',
            replyOptions: {
                rewriteRequestHeaders: (_originalReq, headers) => {
                    return {
                        ...headers,
                        authorization: server.jwt.sign({ id: "root", role: "root", rate: "4" }),
                    }
                }
            }
        })
    }
}