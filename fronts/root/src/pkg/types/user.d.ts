export interface IUser {
    _id: string
    role: "root" | "admin" | "user"
    createdAt: Date
    name: string
    email: string
    psw?: string | null
    rate: 0 | number
    featuredServices: ServicesIdsType[]
}

export type ServicesIdsType = "channel-content" | "viral-headlines" | "education-posts" | "post-chronicle"