import { Model, Schema, Types, model } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId | string
  createdAt: Date
  name: string
  date: Date
  email: string
  psw: string
  role: "root" | "admin" | "user" 
  rate: "4" | "3" | "2" | "1" | "0"
  featuredServices: ("channel-content" | "viral-headlines" | "education-posts" | "post-chronicle")[]
}

const userSchema = new Schema<IUser>({
  createdAt: { type: Date, default: Date.now },
  name: { type: String, default: "Пользователь ПостФермы" },
  date: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  psw: { type: String, required: true },
  role: { type: String, enum: ["root", "admin", "user"], default: "user" },
  rate: { type: String, enum: ["4", "3", "2", "1", "0"], default: "0" },
  featuredServices: { type: [String], enum: ["channel-content", "viral-headlines", "education-posts", "post-chronicle"], default: [] },
})

interface IUserModel extends Model<IUser> {
}

export const User = model<IUser, IUserModel>("User", userSchema)