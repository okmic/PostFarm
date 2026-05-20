import { FastifyInstance } from 'fastify';
import userController from './user.controller';
import { cheackJwtInHeader } from '../../utils/auth.util';

export default class UserModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){

        server.get('/api/users/me', {
            preHandler: cheackJwtInHeader,
            handler: userController.getMe,
        })

        server.put('/api/users/me', {
            preHandler: cheackJwtInHeader,
            handler: userController.updateUser,
        })
    }
};