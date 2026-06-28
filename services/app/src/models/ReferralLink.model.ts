import { Model, Schema, Types, model } from 'mongoose'
import { IUser } from './User.model'

export interface IReferralLink {
  _id: Types.ObjectId | string
  date: Date
  code: string
  creationLimit: number
  createdByLink: number
  active: boolean
  source: string
  rate: IUser["rate"]
  role: IUser["role"]
  linkExpirationDate: {
    date: Date | null
    role: IUser["role"] | null
    rate: IUser["rate"] | null
  }
}

export type IReferralLinkType = IReferralLink & Document

const ReferralLinkSchema = new Schema<IReferralLinkType>({
  date: { type: Date, default: Date.now },
  code: { type: String, required: true },
  creationLimit: { type: Number, required: true },
  createdByLink: { type: Number, required: true },
  active: { type: Boolean, required: true },
  source: { type: String, required: true },
  role: { type: String, enum: ["root", "admin", "user"], required: true },
  rate: { type: Number, required: true},
  linkExpirationDate: {
    date: { type: Date, required: false, default: null },
    role: { type: String, enum: ["root", "admin", "user"], required: false },
    rate: { type: Number, required: false},
  }
})

interface IReferralLinkModel extends Model<IReferralLinkType> {
}

export const ReferralLink = model<IReferralLinkType, IReferralLinkModel>("ReferralLink", ReferralLinkSchema)