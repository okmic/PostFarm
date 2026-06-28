import { Model, Schema, Types, model } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId | string
  createdAt: Date
  name: string
  date: Date
  email: string
  psw: string
  role: "root" | "admin" | "user" 
  rate: number
  featuredServices: ("channel-content" | "viral-headlines" | "education-posts" | "post-chronicle")[]
  blocked: boolean
  expirationRateDate: {
    date: Date | null
    role: IUser["role"] | null
    rate: IUser["rate"] | null
  }
}

const userSchema = new Schema<IUser>({
  createdAt: { type: Date, default: Date.now },
  name: { type: String, default: "Пользователь ПостФермы" },
  date: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  psw: { type: String, required: true },
  role: { type: String, enum: ["root", "admin", "user"], default: "user" },
  rate: { type: Number, default: 3 },
  featuredServices: { type: [String], enum: ["channel-content", "viral-headlines", "education-posts", "post-chronicle"], default: [] },
  blocked: { type: Boolean, required: false, default: false },
  expirationRateDate: {
    date: { type: Date, required: false, default: null },
    role: { type: String, enum: ["root", "admin", "user"], required: false },
    rate: { type: Number, required: false},
  }
})

interface IUserModel extends Model<IUser> {
}

export const User = model<IUser, IUserModel>("User", userSchema)