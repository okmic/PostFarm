import { FastifyInstance } from 'fastify';
import signController from './sign.controller';

export default class SignModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){
        server.post('/api/signin', {
            handler: signController.signin
        })
        server.post('/api/signup', {
            handler: signController.signup
        })
    }
};