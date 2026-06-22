import { FastifyInstance } from 'fastify';
import postController from './post.controller';
import { cheackJwtInHeader } from '../../utils/auth.util';

export default class PostModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance) {
        server.get('/api/posts', {
            preHandler: cheackJwtInHeader,
            handler: postController.getPosts,
        })
    }
};
