export const ALLOWED_DOMAINS = [
  'yandex.ru', 'yandex.by', 'yandex.kz', 'ya.ru',
  'mail.ru', 'bk.ru', 'inbox.ru', 'list.ru', 'internet.ru',
  'vk.com',
]

export const validateEmail = (email: string): string | null => {
  if (!email.includes('@')) return 'Некорректный email'
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return `Регистрация доступна только для: ${ALLOWED_DOMAINS.map(d => `@${d}`).join(', ')}`
  }
  
  return null
}