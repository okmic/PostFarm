import { FastifyInstance } from 'fastify';
import aiTextController from './ai.text.controller';

export default class AITextModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){
        server.post('/api/ai/text/post-chronicle', {
            handler: aiTextController.postChronicle,
        })
        server.post('/api/ai/text/channel-content', {
            handler: aiTextController.channelContent,
        })
        server.post('/api/ai/text/viral-headlines', {
            handler: aiTextController.viralHeadlines,
        })
    }
};