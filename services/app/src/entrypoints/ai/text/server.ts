import type { FastifyInstance } from "fastify"
import AITextModule from "../../../modules/ai/text/ai.text.module"
import AiTokensModule from "../../../modules/aiTokens/aiTokens.module"

export default class AIGPTTextServer {

  constructor(server: FastifyInstance) {
    this.initModules(server)
  }

  initModules(server: FastifyInstance){
    new AITextModule(server)
    new AiTokensModule(server)
  }
}


