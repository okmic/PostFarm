import { FastifyInstance } from 'fastify';
import GptTextModule from './gpt/gpt.text.module';
import UserModule from '../user/user.module';

export default class GatewayModule {
    constructor(server: FastifyInstance) {
        new UserModule(server)
        new GptTextModule(server)
    }
}
