import { FastifyInstance } from 'fastify';
import userController from '../user/user.controller';
import { cheackJwtInHeaderRoot } from '../../utils/auth.util';
import referralLinkController from '../referralLink/referralLink.controller';
import signController from '../sign/sign.controller';

export default class RootModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){
        server.post('/api/root/signin', {
            handler: signController.signin
        })
        server.get('/api/root/users', {
            preHandler: cheackJwtInHeaderRoot,
            handler: userController.find,
        })
        server.put('/api/root/users/:userId', {
            preHandler: cheackJwtInHeaderRoot,
            handler: userController.updateSomeUser,
        })
        server.get('/api/root/referral-links', {
            preHandler: cheackJwtInHeaderRoot,
            handler: referralLinkController.find
        })
        server.post('/api/root/referral-links', {
            preHandler: cheackJwtInHeaderRoot,
            handler: referralLinkController.create
        })
        server.put('/api/root/referral-links/:id', {
            preHandler: cheackJwtInHeaderRoot,
            handler: referralLinkController.update
        })
        server.delete('/api/root/referral-links/:id', {
            preHandler: cheackJwtInHeaderRoot,
            handler: referralLinkController.delete
        })
    }
};
