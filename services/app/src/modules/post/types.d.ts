export interface ICreatePostProps {
  content: string 
  userId: Types.ObjectId | string
  isAI: boolean
  reactions: (Types.ObjectId | string)[]
  comments: (Types.ObjectId | string)[]
}

export interface IGetPostsProps {
    userId?: Types.ObjectId | string
}