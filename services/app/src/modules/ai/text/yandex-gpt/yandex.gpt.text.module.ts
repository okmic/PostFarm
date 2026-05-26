import { FastifyInstance } from 'fastify';
import YandexGptTextController from './yandex.gpt.text.controller';

export default class YandexGptTextModule {
    constructor(server: FastifyInstance) {
        this.getRoutes(server)
    }

    private getRoutes(server: FastifyInstance){
        server.post('/api/ai/text/yandex-gpt', {
            handler: YandexGptTextController.textGenerate,
        })
    }
};