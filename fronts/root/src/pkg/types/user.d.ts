export interface IUser {
    _id: string
    role: "root" | "admin" | "user"
    createdAt: Date
    name: string
    email: string
    psw?: string | null
    rate: 0 | number
    blocked: boolean
    featuredServices: ServicesIdsType[]
    expirationRateDate: {
        date: Date | null
        role: IUser["role"] | null
        rate: IUser["rate"] | null
    }
}

export type ServicesIdsType = "channel-content" | "viral-headlines" | "education-posts" | "post-chronicle"