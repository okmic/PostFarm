import VkBot from 'node-vk-bot-api'
import axios from 'axios'

const VKToken =  ""

export const startvkbot = async () => {
    try {
        const bot = new VkBot({
            token: VKToken,
        })
        bot.startPolling((e) => {
            if (e) console.error(e.response)
            return {}
        })
    } catch (e) {
        console.error(e)
    }
}


const GROUP_ID = 123213

export const getAllPosts = async () => {
    try {
        const response = await axios.get('https://api.vk.com/method/wall.get', {
            params: {
                access_token: VKToken,
                owner_id: -GROUP_ID,
                count: 10,
                v: '5.199'
            }
        })

        if (response.data.error) {
            console.error('Ошибка:', response.data.error.error_msg)
            return []
        }

        const posts = response.data.response.items
        console.log('Посты:', posts)
        return posts

    } catch (e) {
        console.error(e)
    }
}
export const createPost = async () => {
    try {
        const response = await axios.get('https://api.vk.com/method/wall.post', {
            params: {
                access_token: VkBot,
                owner_id: -GROUP_ID,
                from_group: 1,           // публикуем от имени группы
                message: 'Привет! Это мой первый пост через API 🚀',
                v: '5.199'
            }
        })

        if (response.data.error) {
            console.error('Ошибка:', response.data.error.error_msg)
            return null
        }

        const postId = response.data.response.post_id
        console.log('Пост создан! ID:', postId)
        console.log('Ссылка:', `https://vk.com/wall-${GROUP_ID}_${postId}`)
        return postId

    } catch (e) {
        console.error(e)
    }
}
