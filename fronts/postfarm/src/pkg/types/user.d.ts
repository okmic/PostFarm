export interface IUser {
    _id: string
    role: "admin" | "user"
    name: string
    email: string
    psw?: string | null
    rate: "0" | "1" | "2" | "3" | "4"
    featuredServices: ServicesIdsType[]
}

export type ServicesIdsType = "channel-content" | "viral-headlines" | "education-posts" | "post-chronicle"