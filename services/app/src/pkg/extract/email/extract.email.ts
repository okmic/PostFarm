import { logger } from "../../../pkg/logger/logger.service"

export default class ExtractEmail {

    logPrefix
    text

    constructor(text: string) {
        this.logPrefix = `EXTRACT-EMAIL-MODULE-${new Date().toDateString()}`
        this.text = text
    }

    public async handleEmailInput(): Promise<string | null> {
        try {
            logger.log(`[START-${this.logPrefix}] - 🔍 Начало анализа текста: "${this.text}"`)
            
            const emailAddress = this.extractEmailFromText()

            if (emailAddress) {
                logger.log(`[FOUND-${this.logPrefix}] - 📧 Найден email: ${emailAddress}`)
                const normalizedEmail = this.normalizeEmail(emailAddress)
                logger.log(`[NORMALIZE-${this.logPrefix}] - 🛠️ Нормализованный email: ${normalizedEmail}`)

                if (this.isValidEmail(normalizedEmail)) {
                    logger.log(`[SUCCESS-${this.logPrefix}] - ✅ Валидный email: ${normalizedEmail}`)
                    return normalizedEmail
                } else {
                    logger.log(`[ERROR-${this.logPrefix}] - ❌ Невалидный email: ${normalizedEmail}`)
                    return null
                }
            } else {
                logger.log(`[SKIP-${this.logPrefix}] - ⚠️ Email адрес не найден в тексте`)
                return null
            }
        } catch (e) {
            logger.log(`[ERROR-${this.logPrefix}] - 💥 Критическая ошибка при обработке email`)
            return null
        }
    }

    private extractEmailFromText(): string | null {
        logger.log(`[SEARCH-${this.logPrefix}] - 🔎 Поиск email в тексте: "${this.text}"`)

        // Основная регулярка для поиска email
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

        const matches = this.text.match(emailRegex)
        logger.log(`[MATCH-${this.logPrefix}] - 📊 Найдены совпадения:`, matches)

        if (matches && matches.length > 0) {
            let extractedEmail = matches[0].trim()
            logger.log(`[EXTRACT-${this.logPrefix}] - 🎯 Извлеченный email: ${extractedEmail}`)

            // Обработка специальных случаев
            extractedEmail = this.cleanEmail(extractedEmail)
            logger.log(`[CLEAN-${this.logPrefix}] - 🧹 Очищенный email: ${extractedEmail}`)

            return extractedEmail
        }

        logger.log(`[NOT_FOUND-${this.logPrefix}] - ❌ Email не найден в тексте`)
        return null
    }

    private cleanEmail(email: string): string {
        let cleaned = email.trim()
        
        // Удаление точек в конце (кроме домена)
        cleaned = cleaned.replace(/\.+$/, '')
        
        // Удаление лишних пробелов
        cleaned = cleaned.replace(/\s+/g, '')
        
        // Приведение к нижнему регистру
        cleaned = cleaned.toLowerCase()
        
        // Обработка email в угловых скобках
        cleaned = cleaned.replace(/^<|>$/g, '')
        
        logger.log(`[CLEAN_DETAILS-${this.logPrefix}] - 🧹 Детальная очистка: ${email} -> ${cleaned}`)
        return cleaned
    }

    private isValidEmail(email: string): boolean {
        // Более строгая валидация email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid = emailRegex.test(email)
        
        logger.log(`[VALIDATION-${this.logPrefix}] - 📋 Результат валидации ${email}: ${isValid ? 'VALID' : 'INVALID'}`)
        
        // Дополнительные проверки
        if (isValid) {
            const [localPart, domain] = email.split('@')
            
            // Проверка длины локальной части
            if (localPart.length > 64) {
                logger.log(`[ERROR-${this.logPrefix}] - ❌ Локальная часть слишком длинная: ${localPart.length} символов`)
                return false
            }
            
            // Проверка длины домена
            if (domain.length > 253) {
                logger.log(`[ERROR-${this.logPrefix}] - ❌ Домен слишком длинный: ${domain.length} символов`)
                return false
            }
            
            // Проверка на двойные точки
            if (email.includes('..')) {
                logger.log(`[ERROR-${this.logPrefix}] - ❌ Найдены двойные точки в email`)
                return false
            }
            
            logger.log(`[VALIDATION_DETAILS-${this.logPrefix}] - ✅ Дополнительные проверки пройдены`)
        }
        
        return isValid
    }

    private normalizeEmail(email: string): string {
        logger.log(`[NORMALIZE_START-${this.logPrefix}] - 🛠️ Начало нормализации: ${email}`)
        
        let normalized = email.toLowerCase().trim()
        logger.log(`[NORMALIZE_CASE-${this.logPrefix}] - 🔄 Приведение к нижнему регистру: ${normalized}`)

        // Удаление пробелов
        normalized = normalized.replace(/\s+/g, '')
        logger.log(`[NORMALIZE_SPACES-${this.logPrefix}] - 🔄 Удаление пробелов: ${normalized}`)

        // Удаление точек в начале и конце локальной части
        const [localPart, domain] = normalized.split('@')
        if (localPart && domain) {
            let cleanLocalPart = localPart.replace(/^\.+|\.+$/g, '')
            normalized = `${cleanLocalPart}@${domain}`
            logger.log(`[NORMALIZE_DOTS-${this.logPrefix}] - 🔄 Очистка точек: ${normalized}`)
        }

        // Проверка на минимальную длину
        if (normalized.length < 6) { // a@b.c
            logger.log(`[ERROR-${this.logPrefix}] - ❌ Email слишком короткий: ${normalized}`)
            return normalized
        }

        if (this.isValidEmail(normalized)) {
            logger.log(`[SUCCESS-${this.logPrefix}] - ✅ Успешная нормализация: ${normalized}`)
        } else {
            logger.log(`[WARNING-${this.logPrefix}] - ⚠️ Нормализованный email может быть невалидным: ${normalized}`)
        }

        return normalized
    }

    // Дополнительный метод для получения всех email из текста
    public async extractAllEmails(): Promise<string[]> {
        try {
            logger.log(`[START-${this.logPrefix}] - 🔍 Поиск всех email в тексте`)
            
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
            const matches = this.text.match(emailRegex) || []
            
            logger.log(`[FOUND_ALL-${this.logPrefix}] - 📊 Найдено email: ${matches.length}`)
            
            const validEmails: string[] = []
            
            for (const match of matches) {
                const normalized = this.normalizeEmail(match)
                if (this.isValidEmail(normalized)) {
                    validEmails.push(normalized)
                    logger.log(`[VALID_EMAIL-${this.logPrefix}] - ✅ Добавлен валидный email: ${normalized}`)
                } else {
                    logger.log(`[INVALID_EMAIL-${this.logPrefix}] - ❌ Пропущен невалидный email: ${normalized}`)
                }
            }
            
            logger.log(`[COMPLETE-${this.logPrefix}] - 🎯 Завершено извлечение email. Найдено валидных: ${validEmails.length}`)
            return validEmails
            
        } catch (e) {
            logger.log(`[ERROR-${this.logPrefix}] - 💥 Ошибка при извлечении всех email`)
            return []
        }
    }
}