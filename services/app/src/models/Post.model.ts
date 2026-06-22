import { Document, Schema, model, Types, Model } from 'mongoose'

export interface IPost extends Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date | null
  content: string
  userId: Types.ObjectId
  isAI: boolean
}

const postSchema = new Schema<IPost>({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  isAI: { type: Boolean, default: false },
})

interface IPostModel extends Model<IPost> {}

export const Post = model<IPost, IPostModel>('Post', postSchema)
