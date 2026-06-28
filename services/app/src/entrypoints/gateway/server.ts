import { type FastifyInstance } from "fastify"
import UserModule from "../../modules/user/user.module"
import PostModule from "../../modules/post/post.module"
import RootModule from "../../modules/root/root.module"

export default class TenantServer {
  constructor(server: FastifyInstance) {
    this.initModules(server)
  }

  initModules(server: FastifyInstance){
    new UserModule(server)
    new PostModule(server)
    new RootModule(server)
  }

}
