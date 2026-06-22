import { FastifyReply, FastifyRequest } from "fastify";
import postService from "./post.service";
import { successResponse } from "../../pkg/request/response.handler";

class PostController {

    async getPosts(req: FastifyRequest<{ }>, reply: FastifyReply) {
        const reqUserId = (req?.user as any)?.id

        const posts = await postService.get({ userId: reqUserId })

        return successResponse("success", { posts }, reply)
    }

}

export default new PostController()
