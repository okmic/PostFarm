import { Document, Schema, model, Types, Model } from 'mongoose'

export interface IBot extends Document {
  _id: Types.ObjectId
  createdAt: Date
  name: string
  vk: {
    startIn?: Date

  }
}

const botSchema = new Schema<IBot>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  vk: {
    startIn: { type: String, default: null },
  },
})

interface IBotModel extends Model<IBot> {
}


export const Bot = model<IBot, IBotModel>('Bot', botSchema)
