import { FastifyInstance } from 'fastify';

export default class PostModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){
    }
};
