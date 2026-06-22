import { FastifyInstance } from 'fastify';
import postController from './aiTokens.controller';
import { cheackJwtInHeader } from '../../utils/auth.util';

export default class AiTokensModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance) {
        server.get('/api/ai/usage-tokens', {
            preHandler: cheackJwtInHeader,
            handler: postController.getUsageTokens,
        })
    }
};
