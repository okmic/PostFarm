import dotenv from "dotenv"

if(process.env.MOD !== "docker") {
    dotenv.config()
}

const value = (value: any): string  => {
    if(!value) throw new Error('Invalid env property: ' + value)
    return value as string
}

export default {
    adminClientURI: value(process.env.ADMIN_CLIENT_URI),
    PORT: value(process.env.PORT),
    ROOT_SECRET: value(process.env.ROOT_SECRET),
    JWT_SECRET: value(process.env.JWT_SECRET),
    MONGODB_URI: value(process.env.MONGODB_URI),
    MONGODB_NAME: value(process.env.MONGODB_NAME),
    mail: {
        user: value(process.env.MAIL_USER),
        pass: value(process.env.MAIL_PASS),
    },
    rootUser: {
        id: value(process.env.ROOT_USER_ID),
        email: value(process.env.ROOT_USER_EMAIL),
        psw: value(process.env.ROOT_USER_PSW),
    },
    services: {
        gateway: {
            url: value(process.env.GATWAY_URI),
            PORT: Number(value(process.env.GATWAY_PORT)),
        },
        ai: {
            text: {
                uri: value(process.env.AI_TEXT_GPT_URI),
                PORT: Number(value(process.env.AI_TEXT_GPT_PORT)),
                JWT_SECRET: value(process.env.AI_TEXT_GPT_JWT_SECRET),
                yandex: {
                    openAIApiKey: value(process.env.YANDEX_AI_API_KEY),
                    openAIProjectId: value(process.env.YANDEX_AI_YANDEX_PROJECT_ID),
                    openAIPromptId: value(process.env.YANDEX_AI_YANDEX_PROMPT_ID),
                }
            }
        },
    }
}
