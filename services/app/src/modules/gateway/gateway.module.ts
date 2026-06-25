import { FastifyInstance } from 'fastify';
import GptTextModule from './gpt/gpt.text.module';
import UserModule from '../user/user.module';
import PostModule from '../post/post.module';
import AiTokensModule from '../aiTokens/aiTokens.module';
import RootModule from '../root/root.module';

export default class GatewayModule {
    constructor(server: FastifyInstance) {
        new UserModule(server)
        new GptTextModule(server)
        new PostModule(server)
        new AiTokensModule(server)
        new RootModule(server)
    }
}
