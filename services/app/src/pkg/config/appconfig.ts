import dotenv from "dotenv"
dotenv.config()

const value = (value: any): string  => {
    if(!value) throw new Error('Invalid env property: ' + value)
    return value as string
}

export default {
    ROOT_SECRET: value(process.env.ROOT_SECRET),
    JWT_SECRET: value(process.env.JWT_SECRET),
    MONGODB_URI: value(process.env.MONGODB_URI),
    MONGODB_NAME: value(process.env.MONGODB_NAME),
    services: {
        gateway: {
            url: value(process.env.GATWAY_URI),
            PORT: Number(value(process.env.GATWAY_PORT)),
        },
        vk: {
            uri: value(process.env.VK_URI),
            PORT: Number(value(process.env.VK_PORT)),
            JWT_SECRET: Number(value(process.env.VK_JWT_SECRET)),
        },
    }
}
