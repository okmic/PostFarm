import VkBot from 'node-vk-bot-api'
import Session from 'node-vk-bot-api/lib/session'

class VKBotService {
    private bot: VkBot

    constructor() {
        this.bot = new VkBot({
            token: "vk1.a.TTo5J6wJHEDokugLONM4CNJwiPF6uH9rTQfaaCOArfoa_QLmN3G4wEK2piw-6YQoYG06iNFJZccFkkudJnDPWZNt2h1ySNGDeQQ4U2f_Xz041Zg-ZY2iEQGsJamzSBxz0p4hO_BC0symwpEC4IQ89yY8g3bbM5S1PdhXgZTN7yf4HAwiFTkY1-kky1ei5aIGEfCB7xn56uCc8wia752YAQ",
  
        })

        this.bot.startPolling((e) => {
            if(e) console.error(e.response)
            return {}
        })
        this.setupCommands()
    }

/*     private setupScenes(): Stage {
        // Сцена регистрации
        const registerScene = new Scene('register',
            // Шаг 1: Приветствие
            async (ctx) => {
                ctx.scene.next()
                await ctx.reply('Как вас зовут?')
            },
            // Шаг 2: Получаем имя
            async (ctx) => {
                ctx.session.name = ctx.message.text
                ctx.scene.next()
                await ctx.reply('Сколько вам лет?')
            },
            // Шаг 3: Получаем возраст и завершаем
            async (ctx) => {
                const age = parseInt(ctx.message.text)
                
                if (isNaN(age) || age < 0 || age > 150) {
                    await ctx.reply('Пожалуйста, введите корректный возраст')
                    return
                }

                ctx.session.age = age
                ctx.scene.leave()
                
                await ctx.reply(
                    `Приятно познакомиться, ${ctx.session.name}!\n` +
                    `Вам ${ctx.session.age} лет.`
                )
            }
        )

        // Сцена опроса
        const surveyScene = new Scene('survey',
            async (ctx) => {
                ctx.scene.next()
                await ctx.reply('Как вы оцениваете нашего бота от 1 до 10?')
            },
            async (ctx) => {
                const rating = parseInt(ctx.message.text)
                
                if (isNaN(rating) || rating < 1 || rating > 10) {
                    await ctx.reply('Пожалуйста, введите число от 1 до 10')
                    return
                }

                ctx.session.rating = rating
                ctx.scene.next()
                await ctx.reply('Что бы вы хотели улучшить?')
            },
            async (ctx) => {
                ctx.session.feedback = ctx.message.text
                ctx.scene.leave()
                
                await ctx.reply(
                    'Спасибо за ваш отзыв! 🙏\n' +
                    `Оценка: ${ctx.session.rating}/10\n` +
                    `Пожелания: ${ctx.session.feedback}`
                )
            }
        )

        return new Stage(registerScene, surveyScene)
    } */


    private setupCommands(): void {
        // Команда /start
        this.bot.command('/start', async (ctx) => {
            await ctx.reply(
                'Привет! 👋\n' +
                'Я бот-помощник.\n\n' +
                'Доступные команды:\n' +
                '/help - Помощь\n' +
                '/register - Регистрация\n' +
                '/survey - Пройти опрос\n' +
                '/random - Случайное число\n' +
                '/info - Информация о пользователе'
            )
        })

        // Команда /help
        this.bot.command('/help', async (ctx) => {
            await ctx.reply(
                '📋 Список команд:\n\n' +
                '/start - Начало работы\n' +
                '/help - Эта справка\n' +
                '/register - Регистрация (сцена)\n' +
                '/survey - Пройти опрос (сцена)\n' +
                '/random - Случайное число от 1 до 100\n' +
                '/info - Информация о вас\n' +
                '/echo [текст] - Повторить текст'
            )
        })

        // Команда /random
        this.bot.command('/random', async (ctx) => {
            const random = Math.floor(Math.random() * 100) + 1
            await ctx.reply(`🎲 Случайное число: ${random}`)
        })

        // Команда /info
        this.bot.command('/info', async (ctx) => {
            const user = await this.bot.execute('users.get', {
                user_ids: ctx.message.from_id,
                fields: 'photo_200,city,last_seen'
            })

            const userInfo = user[0]
            
            await ctx.reply(
                `👤 Информация о пользователе:\n` +
                `Имя: ${userInfo.first_name} ${userInfo.last_name}\n` +
                `ID: ${userInfo.id}\n` +
                `Профиль: ${userInfo.is_closed ? 'Закрытый' : 'Открытый'}`
            )
        })

        // Команды без префикса
        this.bot.command(['Привет', 'привет', 'здарова'], async (ctx) => {
            await ctx.reply('Привет! Напишите /help для списка команд.')
        })

        // Обработка всех остальных сообщений
        this.bot.on(async (ctx) => {
            await ctx.reply(
                'Я не понимаю эту команду.\n' +
                'Напишите /help для получения справки.'
            )
        })

        // Обработка события редактирования сообщения
        this.bot.event('message_edit', async (ctx) => {
            await ctx.reply('Вы отредактировали сообщение!')
        })
    }

    // Получение webhook callback для Fastify/Express
    get webhookCallback() {
        return this.bot.webhookCallback.bind(this.bot)
    }



    // Остановка бота
    stop(): void {
        this.bot.stop()
    }

    // Перезапуск бота
    start(): void {
        this.bot.start()
    }

    // Отправка сообщения конкретному пользователю
    async sendMessageToUser(userId: number, message: string): Promise<void> {
        await this.bot.sendMessage(userId, message)
    }
}

export default new VKBotService()