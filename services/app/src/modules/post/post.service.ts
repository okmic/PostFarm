import { Post } from "../../models/Post.model"
import type { ICreatePostProps, IGetPostsProps } from "./types"

class PostService {
  async create(props: ICreatePostProps) {
    return await Post.create(props)
  }
  async get(props: IGetPostsProps) {
    return await Post.find(props)
  }
}

export default new PostService()
