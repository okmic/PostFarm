import { FastifyInstance } from 'fastify';
import aiTextController from './ai.text.controller';
import { cheackJwtInHeader } from '../../../utils/auth.util';
import { AIRateLimitHandler } from '../../../utils/ai.rate.util';

export default class AITextModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance) {
        server.post('/api/ai/text/post-chronicle', {
            preHandler: async (req, res, next) => {
                await cheackJwtInHeader(req, res, next)
                    .then(async () => await AIRateLimitHandler((req?.user as any)?.id))
            },
            handler: aiTextController.postChronicle,
        })
        server.post('/api/ai/text/channel-content', {
            preHandler: async (req, res, next) => {
                await cheackJwtInHeader(req, res, next)
                    .then(async () => await AIRateLimitHandler((req?.user as any)?.id))
            },
            handler: aiTextController.channelContent,
        })
        server.post('/api/ai/text/viral-headlines', {
            preHandler: async (req, res, next) => {
                await cheackJwtInHeader(req, res, next)
                    .then(async () => await AIRateLimitHandler((req?.user as any)?.id))
            },
            handler: aiTextController.viralHeadlines,
        })
        server.post('/api/ai/text/education-post', {
            preHandler: async (req, res, next) => {
                await cheackJwtInHeader(req, res, next)
                    .then(async () => await AIRateLimitHandler((req?.user as any)?.id))
            },
            handler: aiTextController.educationPost,
        })
    }
};

