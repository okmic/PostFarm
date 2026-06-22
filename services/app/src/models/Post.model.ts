import { Document, Schema, model, Types, Model } from 'mongoose'

export interface IPost  {
  _id: Types.ObjectId | string
  createdAt: Date
  updatedAt: Date | null
  content: string
  userId: Types.ObjectId
  isAI: boolean
}

export type PostDocumentType = IPost & Document

const postSchema = new Schema<PostDocumentType>({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  isAI: { type: Boolean, default: false },
})

interface IPostModel extends Model<PostDocumentType> {}

export const Post = model<PostDocumentType, IPostModel>('Post', postSchema)
