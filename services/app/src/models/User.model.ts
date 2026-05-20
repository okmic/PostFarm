import { Model, Schema, Types, model } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId | string
  name: string
  date: Date
  email: string
  psw: string
  role: "root" | "admin" | "user" 
  rate: "4" | "3" | "2" | "1" | "0"
}

const userSchema = new Schema<IUser>({
  name: { type: String, default: "MBot" },
  date: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  psw: { type: String, required: true },
  role: { type: String, enum: ["root", "admin", "user"], default: "user" },
  rate: { type: String, enum: ["4", "3", "2", "1", "0"], default: "0" },
})

interface IUserModel extends Model<IUser> {
}

export const User = model<IUser, IUserModel>("User", userSchema)