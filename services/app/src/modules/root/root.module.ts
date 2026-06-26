import { FastifyInstance } from 'fastify';
import userController from '../user/user.controller';
import { cheackJwtInHeaderRoot } from '../../utils/auth.util';
import referralLinkController from '../referralLink/referralLink.controller';

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

        server.get('/api/root/referral-links', {
            handler: referralLinkController.find
        })
        server.post('/api/root/referral-links', {
            handler: referralLinkController.create
        })
        server.put('/api/root/referral-links/:id', {
            handler: referralLinkController.update
        })
        server.delete('/api/root/referral-links/:id', {
            handler: referralLinkController.delete
        })
    }
};