import { Model, Schema, Types, model } from 'mongoose'

export interface ISignupCode {
  _id: Types.ObjectId | string
  date: Date
  code: string
  userId: Types.ObjectId | string
}

export type SignupCodeType = ISignupCode & Document

const signupCodeSchema = new Schema<SignupCodeType>({
  date: { type: Date, default: Date.now },
  code: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
})

interface ISignupCodeModel extends Model<SignupCodeType> {
}

export const SignupCode = model<SignupCodeType, ISignupCodeModel>("SignupCode", signupCodeSchema)
