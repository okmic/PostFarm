import { FastifyInstance } from 'fastify';
import userController from '../user/user.controller';
import { cheackJwtInHeaderRoot } from '../../utils/auth.util';

export default class RootModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){

        server.get('/api/root/users', {
            preHandler: cheackJwtInHeaderRoot,
            handler: userController.find,
        })

        server.put('/api/root/users/:userId', {
            preHandler: cheackJwtInHeaderRoot,
            handler: userController.updateSomeUser,
        })
    }
};