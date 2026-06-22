import { Document, Schema, model, Types, Model } from 'mongoose'
import type { ServicesTypeEnum } from '../../../../pkg/types/ai.text.types'

export interface IAITokens {
  _id: Types.ObjectId | string
  createdAt: Date
  usageTokens: number
  beforeText: string
  afterText: string
  type: "text"
  ai: "yandex" | "openai"
  userId: Types.ObjectId
  postId: Types.ObjectId
  service: ServicesTypeEnum
}

export type AITokensDocumentType = IAITokens & Document

const aiTokensSchema = new Schema<AITokensDocumentType>({
  usageTokens: { type: Number, required: true },
  beforeText: { type: String, required: true },
  afterText: { type: String, required: true },
  type: { type: String, enum: ["text"], required: true },
  ai: { type: String, enum: ["yandex", "openai"], required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  postId: { type: Schema.Types.ObjectId, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

interface IAITokensModel extends Model<AITokensDocumentType> {}

export const AITokens = model<AITokensDocumentType, IAITokensModel>('AITokens', aiTokensSchema)